import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type { InputType } from 'mow-registry/components/traffic-measure';
import type CodeList from 'mow-registry/models/code-list';
import Variable from 'mow-registry/models/variable';
import type CodelistsService from 'mow-registry/services/codelists';
import type Store from '@ember-data/store';
import Component from '@glimmer/component';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import ReactiveTable from 'mow-registry/components/reactive-table';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import PowerSelect from 'ember-power-select/components/power-select';
import ErrorMessage from 'mow-registry/components/error-message';
import { eq } from 'ember-truth-helpers';
import findByValue from 'mow-registry/helpers/find-by-value';
import { trackedFunction } from 'reactiveweb/function';
import { removeItem } from 'mow-registry/utils/array';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';

interface Signature {
  Args: {
    trafficSignal: TrafficSignalConcept;
  };
}

export default class VariableManager extends Component<Signature> {
  @service declare intl: IntlService;
  variableTypes: Array<InputType>;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare store: Store;
  @tracked codeLists?: CodeList[];
  @tracked editMode = false;
  @tracked variableToAdd?: Variable;
  @tracked pageNumber = 0;
  pageSize = 20;
  @tracked isAddVariableModalOpen = false;

  constructor(
    owner: Owner | undefined,
    args: {
      trafficSignal: TrafficSignalConcept;
    },
  ) {
    super(owner, args);

    this.variableTypes = [
      {
        value: 'text',
        label: this.intl.t('utility.template-variables.text'),
      },
      {
        value: 'number',
        label: this.intl.t('utility.template-variables.number'),
      },
      {
        value: 'date',
        label: this.intl.t('utility.template-variables.date'),
      },
      {
        value: 'location',
        label: this.intl.t('utility.template-variables.location'),
      },
      {
        value: 'codelist',
        label: this.intl.t('utility.template-variables.codelist'),
      },
    ];
    this.fetchCodeLists();
  }

  fetchCodeLists = () => {
    this.codeListService.all
      .perform()
      .then((codelists) => (this.codeLists = codelists))
      .catch((error) => console.error('Error fetching code lists:', error));
  };

  startEditMode = () => {
    this.editMode = true;
  };

  endEditMode = () => {
    this.editMode = false;
  };

  cancelEdit = async () => {
    const variables = [...(await this.args.trafficSignal.variables)];
    for (let variable of variables) {
      await variable.rollbackAttributes();
    }
    await this.args.trafficSignal.rollbackAttributes();
    await this.variables.retry();
    this.endEditMode();
  };

  saveVariables = async () => {
    let isValid = true;
    const variables = await this.variables.value;
    if (!variables) {
      this.endEditMode();
      return;
    }
    for (let variable of variables) {
      if (variable.hasDirtyAttributes) {
        const variableValid = await variable.validate();
        if (!variableValid) isValid = false;
      }
    }
    if (!isValid) {
      return;
    }
    for (let variable of variables) {
      if (variable.hasDirtyAttributes) {
        await variable.save();
      }
    }
    await this.args.trafficSignal.save();
    this.endEditMode();
  };

  setVariableLabel = (variable: Variable, event: InputEvent) => {
    const newLabel = (event.target as HTMLInputElement).value;
    variable.set('label', newLabel);
  };

  setVariableRequired = (variable: Variable) => {
    variable.set('required', !variable.required);
  };

  setVariableType = (variable: Variable, selectedType: InputType) => {
    const actualType = this.variableTypes.find(
      (type) => type.value === variable.type,
    );
    const labelModified = actualType && actualType.label !== variable.label;
    if (variable.type === 'codelist') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = this.codeLists[0];
    }
    variable.set('type', selectedType.value);
    if (!labelModified) {
      variable.set('label', selectedType.label);
    }
  };

  updateCodelist = (variable: Variable, codeList: CodeList) => {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.codeList = codeList;
  };

  variables = trackedFunction(this, async () => {
    await Promise.resolve();
    const variables = await this.store.query<Variable>('variable', {
      'filter[trafficSignalConcept][:id:]': this.args.trafficSignal.id,
      page: {
        number: this.pageNumber,
        size: this.pageSize,
      },
    });
    return variables;
  });
  removeVariable = async (variable: Variable) => {
    variable.deleteRecord();
    await variable.save();
    this.variables.retry();
  };

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
    this.variables.retry();
  };
  closeAddVariableModal = () => {
    this.isAddVariableModalOpen = false;
    this.variableToAdd = undefined;
  };
  startAddVariable = () => {
    this.isAddVariableModalOpen = true;
    this.variableToAdd = this.store.createRecord<Variable>('variable', {
      trafficSignalConcept: this.args.trafficSignal,
    });
  };
  addVariable = async () => {
    const valid = await this.variableToAdd?.validate();
    if (!valid) return;
    await this.variableToAdd?.save();
    this.variables.retry();
    this.closeAddVariableModal();
  };
  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <ReactiveTable
      @content={{this.variables.value}}
      @isLoading={{this.variables.isLoading}}
      @noDataMessage={{t 'variable-manager.no-data'}}
      @page={{this.pageNumber}}
      @pageSize={{this.pageSize}}
      @onPageChange={{this.onPageChange}}
      @hidePagination={{this.editMode}}
    >
      <:menu>
        <div class='au-u-flex au-u-flex--end'>
          {{#if this.editMode}}
            <AuButton
              {{on 'click' this.saveVariables}}
              class='au-u-margin-small'
            >
              {{t 'utility.save'}}
            </AuButton>
            <AuButton
              @skin='secondary'
              {{on 'click' this.cancelEdit}}
              class='au-u-margin-small'
            >
              {{t 'utility.cancel'}}
            </AuButton>
          {{else}}
            <AuButton
              {{on 'click' this.startEditMode}}
              class='au-u-margin-small'
            >
              {{t 'utility.edit'}}
            </AuButton>
          {{/if}}

        </div>
        <AuButton
          @skin='secondary'
          @width='block'
          @icon='plus'
          {{on 'click' this.startAddVariable}}
        >
          {{t 'utility.add-variable'}}
        </AuButton>

      </:menu>
      <:header as |header|>
        <header.Sortable @field='label' @label={{t 'utility.variable'}} />
        <header.Sortable @field='type' @label={{t 'utility.type'}} />
        <header.Sortable @field='required' @label={{t 'utility.required'}} />
        {{#if this.editMode}}<th></th> {{/if}}
      </:header>
      <:body as |variable|>
        <td>
          {{#if this.editMode}}
            <AuInput
              value={{variable.label}}
              @error={{variable.error.label}}
              {{on 'input' (fn this.setVariableLabel variable)}}
            />
            <ErrorMessage @error={{variable.error.label}} />
          {{else}}
            {{variable.label}}
          {{/if}}
        </td>
        <td>
          {{#if this.editMode}}
            <div class={{if variable.error.type 'ember-power-select--error'}}>
              <PowerSelect
                @allowClear={{false}}
                @searchEnabled={{false}}
                @options={{this.variableTypes}}
                @loadingMessage={{t 'utility.loading'}}
                @selected={{findByValue this.variableTypes variable.type}}
                @onChange={{fn this.setVariableType variable}}
                as |type|
              >
                {{type.label}}
              </PowerSelect>
              <ErrorMessage @error={{variable.error.type}} />
            </div>
            {{#if (eq variable.type 'codelist')}}
              <PowerSelect
                @triggerClass='au-u-margin-top-tiny'
                @allowClear={{false}}
                @searchEnabled={{true}}
                @options={{this.codeLists}}
                @selected={{variable.codeList}}
                @onChange={{fn this.updateCodelist variable}}
                as |codeList|
              >
                {{codeList.label}}
              </PowerSelect>
              <ul
                class='au-c-list-help au-c-help-text au-c-help-text--secondary'
              >
                {{#each variable.codeList.concepts as |option|}}
                  <li class='au-c-list-help__item'>{{option.label}}</li>
                {{/each}}
              </ul>
              <ErrorMessage @error={{variable.error.codelist}} />
            {{/if}}
          {{else}}
            {{variable.type}}
          {{/if}}
        </td>
        <td>
          {{#if this.editMode}}
            <AuCheckbox
              @value={{variable.required}}
              @checked={{variable.required}}
              @onChange={{fn this.setVariableRequired variable}}
            >
              {{t 'utility.required'}}
            </AuCheckbox>
          {{else}}
            {{#if variable.required}}
              {{t 'utility.yes'}}
            {{else}}
              {{t 'utility.no'}}
            {{/if}}
          {{/if}}

        </td>
        {{#if this.editMode}}
          <td>
            <AuButton
              @skin='naked'
              @alert='true'
              @icon='trash'
              {{on 'click' (fn this.removeVariable variable)}}
            /></td>
        {{/if}}
      </:body>
    </ReactiveTable>
    <AuModal
      @modalOpen={{this.isAddVariableModalOpen}}
      @closeModal={{this.closeAddVariableModal}}
    >
      <:title>
        {{t 'utility.confirmation.title'}}
      </:title>
      <:body>
        <div>
          <AuLabel
            @error={{this.variableToAdd.error.label}}
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
          >{{t 'utility.variable'}}
          </AuLabel>

          <AuInput
            value={{this.variableToAdd.label}}
            @error={{this.variableToAdd.error.label}}
            {{on 'input' (fn this.setVariableLabel this.variableToAdd)}}
          />
          <ErrorMessage @error={{this.variableToAdd.error.label}} />
          <AuLabel
            @error={{this.variableToAdd.error.type}}
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
          >{{t 'utility.type'}}
          </AuLabel>
          <div
            class={{if
              this.variableToAdd.error.type
              'ember-power-select--error'
            }}
          >
            <PowerSelect
              @allowClear={{false}}
              @searchEnabled={{false}}
              @options={{this.variableTypes}}
              @loadingMessage={{t 'utility.loading'}}
              @selected={{findByValue
                this.variableTypes
                this.variableToAdd.type
              }}
              @onChange={{fn this.setVariableType this.variableToAdd}}
              as |type|
            >
              {{type.label}}
            </PowerSelect>
            <ErrorMessage @error={{this.variableToAdd.error.type}} />
          </div>
          {{#if (eq this.variableToAdd.type 'codelist')}}
            <PowerSelect
              @triggerClass='au-u-margin-top-tiny'
              @allowClear={{false}}
              @searchEnabled={{true}}
              @options={{this.codeLists}}
              @selected={{this.variableToAdd.codeList}}
              @onChange={{fn this.updateCodelist this.variableToAdd}}
              as |codeList|
            >
              {{codeList.label}}
            </PowerSelect>
            <ul class='au-c-list-help au-c-help-text au-c-help-text--secondary'>
              {{#each this.variableToAdd.codeList.concepts as |option|}}
                <li class='au-c-list-help__item'>{{option.label}}</li>
              {{/each}}
            </ul>
            <ErrorMessage @error={{this.variableToAdd.error.codelist}} />
          {{/if}}
        </div>
      </:body>
      <:footer>
        <AuButton {{on 'click' this.addVariable}}>
          {{t 'utility.save'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' this.closeAddVariableModal}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
  </template>
}
