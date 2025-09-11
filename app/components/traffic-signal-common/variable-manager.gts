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
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import humanFriendlyDate from 'mow-registry/helpers/human-friendly-date';
import { getPromiseState } from '@warp-drive/ember';

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
  @tracked variableToEdit?: Variable;
  @tracked pageNumber = 0;
  pageSize = 20;
  @tracked isEditVariableModalOpen = false;
  @tracked sort?: string = 'created-on';
  variableToDelete?: Variable;
  @tracked isDeleteConfirmationOpen = false;

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
    console.log('running');
    await Promise.resolve();
    const variables = await this.store.query<Variable>('variable', {
      'filter[trafficSignalConcept][:id:]': this.args.trafficSignal.id,
      page: {
        number: this.pageNumber,
        size: this.pageSize,
      },
      sort: this.sort,
    });

    return variables;
  });

  get variablesNotDeleted() {
    return this.variables.value?.filter((variable) => !variable.isDeleted);
  }
  removeVariable = async () => {
    this.variableToDelete?.destroyRecord();
    this.closeDeleteConfirmation();
  };

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
    this.variables.retry();
  };
  closeEditVariableModal = () => {
    this.isEditVariableModalOpen = false;
    this.variableToEdit?.rollbackAttributes();
    this.variableToEdit = undefined;
  };
  startAddVariable = () => {
    this.isEditVariableModalOpen = true;
    this.variableToEdit = this.store.createRecord<Variable>('variable', {
      trafficSignalConcept: this.args.trafficSignal,
      createdOn: new Date(),
    });
  };
  startEditVariable = (variable: Variable) => {
    this.isEditVariableModalOpen = true;
    this.variableToEdit = variable;
  };
  saveVariable = async () => {
    const valid = await this.variableToEdit?.validate();
    if (!valid) return;
    await this.variableToEdit?.save();
    this.variables.retry();
    this.closeEditVariableModal();
  };
  onSortChange = (newSort: string) => {
    this.sort = newSort;
    this.variables.retry();
  };
  startDeleteVariableFlow = (variable: Variable) => {
    this.variableToDelete = variable;
    this.isDeleteConfirmationOpen = true;
  };

  closeDeleteConfirmation = () => {
    this.variableToDelete = undefined;
    this.isDeleteConfirmationOpen = false;
  };
  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <ReactiveTable
      @content={{this.variablesNotDeleted}}
      @isLoading={{this.variables.isLoading}}
      @noDataMessage={{t 'variable-manager.no-data'}}
      @page={{this.pageNumber}}
      @pageSize={{this.pageSize}}
      @onPageChange={{this.onPageChange}}
      @hidePagination={{this.editMode}}
      @onSortChange={{this.onSortChange}}
      @sort={{this.sort}}
    >
      <:menu>
        <div class='au-u-flex au-u-flex--end'>
          <AuButton
            @skin='secondary'
            @icon='plus'
            {{on 'click' this.startAddVariable}}
            class='au-u-margin-small'
          >
            {{t 'utility.add-variable'}}
          </AuButton>
        </div>

      </:menu>
      <:header as |header|>
        <header.Sortable @field='label' @label={{t 'utility.variable'}} />
        <header.Sortable @field='type' @label={{t 'utility.type'}} />
        <header.Sortable @field='required' @label={{t 'utility.required'}} />
        <header.Sortable @field='createdOn' @label={{t 'utility.created-on'}} />
        <th></th>
      </:header>
      <:body as |variable|>
        <td>
          {{variable.label}}
        </td>
        <td>
          {{variable.type}}
        </td>
        <td>
          {{#if variable.required}}
            {{t 'utility.yes'}}
          {{else}}
            {{t 'utility.no'}}
          {{/if}}
        </td>
        <td>
          {{humanFriendlyDate variable.createdOn}}
        </td>
        <td>
          <AuButton
            @skin='naked'
            @icon='pencil'
            {{on 'click' (fn this.startEditVariable variable)}}
          />
          <AuButton
            @skin='naked'
            @alert='true'
            @icon='trash'
            {{on 'click' (fn this.startDeleteVariableFlow variable)}}
          />
        </td>

      </:body>
    </ReactiveTable>
    <AuModal
      @modalOpen={{this.isEditVariableModalOpen}}
      @closeModal={{this.closeEditVariableModal}}
    >
      <:title>
        {{#if this.variableToEdit.isNew}}
          {{t 'utility.add-variable'}}
        {{else}}
          {{t 'variable-manager.edit-modal-title'}}
        {{/if}}
      </:title>
      <:body>
        <div>
          <AuLabel
            @error={{this.variableToEdit.error.label}}
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
          >{{t 'utility.variable'}}
          </AuLabel>

          <AuInput
            value={{this.variableToEdit.label}}
            @error={{this.variableToEdit.error.label}}
            {{on 'input' (fn this.setVariableLabel this.variableToEdit)}}
          />
          <ErrorMessage @error={{this.variableToEdit.error.label}} />
          <AuLabel
            @error={{this.variableToEdit.error.type}}
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
          >{{t 'utility.type'}}
          </AuLabel>
          <div
            class={{if
              this.variableToEdit.error.type
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
                this.variableToEdit.type
              }}
              @onChange={{fn this.setVariableType this.variableToEdit}}
              as |type|
            >
              {{type.label}}
            </PowerSelect>
            <ErrorMessage @error={{this.variableToEdit.error.type}} />
          </div>
          {{#if (eq this.variableToEdit.type 'codelist')}}
            {{#let
              (getPromiseState this.variableToEdit.codeList)
              as |codelistPromise|
            }}
              {{#if codelistPromise.isSuccess}}
                <PowerSelect
                  @triggerClass='au-u-margin-top-tiny'
                  @allowClear={{false}}
                  @searchEnabled={{true}}
                  @options={{this.codeLists}}
                  @selected={{codelistPromise.value}}
                  @onChange={{fn this.updateCodelist this.variableToEdit}}
                  as |codeList|
                >
                  {{codeList.label}}
                </PowerSelect>
                {{#if codelistPromise.value}}
                  {{#let
                    (getPromiseState codelistPromise.value.concepts)
                    as |conceptsPromise|
                  }}
                    {{#if conceptsPromise.isSuccess}}
                      <ul
                        class='au-c-list-help au-c-help-text au-c-help-text--secondary'
                      >
                        {{#each conceptsPromise.value as |option|}}
                          <li class='au-c-list-help__item'>{{option.label}}</li>
                        {{/each}}
                      </ul>
                    {{/if}}
                  {{/let}}
                {{/if}}
              {{/if}}
              <ErrorMessage @error={{this.variableToEdit.error.codelist}} />
            {{/let}}
          {{/if}}
        </div>
        <AuLabel
          @error={{this.variableToEdit.error.required}}
          @requiredLabel={{t 'utility.required'}}
        >{{t 'utility.required'}}
        </AuLabel>
        <AuCheckbox
          @value={{this.variableToEdit.required}}
          @checked={{this.variableToEdit.required}}
          @onChange={{fn this.setVariableRequired this.variableToEdit}}
        >
          {{t 'utility.required'}}
        </AuCheckbox>
      </:body>
      <:footer>
        <AuButton {{on 'click' this.saveVariable}}>
          {{t 'utility.save'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' this.closeEditVariableModal}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
    <AuModal
      @modalOpen={{this.isDeleteConfirmationOpen}}
      @closeModal={{this.closeDeleteConfirmation}}
    >
      <:title>
        {{t 'utility.confirmation.title'}}
      </:title>
      <:body>
        <p>
          {{t 'utility.confirmation.body'}}
        </p>
      </:body>
      <:footer>
        <AuButton @alert={{true}} {{on 'click' this.removeVariable}}>
          {{t 'variable-manager.delete'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' this.closeDeleteConfirmation}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
  </template>
}
