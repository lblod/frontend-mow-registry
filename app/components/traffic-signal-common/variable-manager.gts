import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';
import Variable, {
  signVariableTypes,
  type SignVariableType,
} from 'mow-registry/models/variable';
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
import { trackedFunction } from 'reactiveweb/function';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import humanFriendlyDate from 'mow-registry/helpers/human-friendly-date';
import { getPromiseState } from '@warp-drive/ember';
import type VariablesService from 'mow-registry/services/variables-service';
import { isCodelistVariable } from 'mow-registry/models/codelist-variable';
import { and, not, or } from 'ember-truth-helpers';
import { get } from '@ember/helper';
import { isSome } from 'mow-registry/utils/option';

interface Signature {
  Args: {
    trafficSignal: TrafficSignalConcept;
  };
}

export default class VariableManager extends Component<Signature> {
  @service('codelists') declare codeListService: CodelistsService;
  @service declare store: Store;
  @service declare variablesService: VariablesService;

  @tracked variableToEdit?: Variable;
  @tracked pageNumber = 0;
  pageSize = 20;
  @tracked isEditVariableModalOpen = false;
  @tracked sort?: string = 'created-on';
  @tracked variableToDelete?: Variable;
  @tracked isDeleteConfirmationOpen = false;
  @tracked editedCodelist?: CodeList;

  get variableTypes() {
    return signVariableTypes;
  }

  labelForType = (variableType: SignVariableType) => {
    return this.variablesService.defaultLabelForVariableType(variableType);
  };

  codelists = trackedFunction(this, async () => {
    return await this.codeListService.all.perform();
  });

  variables = trackedFunction(this, async () => {
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

  startAddVariable = () => {
    this.isEditVariableModalOpen = true;
    this.variableToEdit = this.store.createRecord<Variable>('variable', {
      trafficSignalConcept: this.args.trafficSignal,
      createdOn: new Date(),
    });
    this.variableToDelete = undefined;
  };

  startEditVariable = (variable: Variable) => {
    this.isEditVariableModalOpen = true;
    this.variableToEdit = variable;
    this.variableToDelete = undefined;
  };

  closeEditVariableModal = () => {
    this.isEditVariableModalOpen = false;
    this.variableToEdit?.rollbackAttributes();
    this.editedCodelist = undefined;
    this.variableToEdit = undefined;
    this.variableToDelete = undefined;
  };

  saveVariable = async () => {
    if (
      this.variableToEdit &&
      isCodelistVariable(this.variableToEdit) &&
      this.editedCodelist
    ) {
      this.variableToEdit.set('codeList', this.editedCodelist);
    }
    const valid = await this.variableToEdit?.validate();
    if (!valid) return;
    await this.variableToEdit?.save();
    await this.variableToDelete?.destroyRecord();
    this.variables.retry();
    this.closeEditVariableModal();
  };

  setVariableLabel = (event: Event) => {
    if (!this.variableToEdit) {
      return;
    }
    const newLabel = (event.target as HTMLInputElement).value;
    this.variableToEdit.label = newLabel;
  };

  toggleVariableRequired = () => {
    if (!this.variableToEdit) {
      return;
    }
    this.variableToEdit.required = !this.variableToEdit.required;
  };

  setVariableType = async (selectedType: SignVariableType) => {
    if (!this.variableToEdit) {
      return;
    }
    if (!this.variableToEdit.isNew) {
      // If the variable that is being edited exists in the database, mark that one for deletion
      this.variableToDelete = this.variableToEdit;
    }
    const labelModified =
      (this.variableToEdit.type &&
        this.variableToEdit.label !==
          this.variablesService.defaultLabelForVariableType(
            this.variableToEdit.type,
          )) ||
      (!this.variableToEdit.type && this.variableToEdit.label);

    const newVar = (await this.variablesService.convertVariableType(
      this.variableToEdit,
      selectedType,
    )) as Variable;
    if (!labelModified) {
      newVar.label =
        this.variablesService.defaultLabelForVariableType(selectedType);
    }
    if (this.variableToEdit.isNew) {
      // If the variable that is being edited does not exist in the database, simply unload it from the store
      this.variableToEdit.unloadRecord();
    }
    this.variableToEdit = newVar;
  };

  updateCodelist = (codeList: CodeList) => {
    this.editedCodelist = codeList;
  };

  startDeleteVariableFlow = (variable: Variable) => {
    this.variableToDelete = variable;
    this.isDeleteConfirmationOpen = true;
  };

  removeVariable = async () => {
    await this.variableToDelete?.destroyRecord();
    this.closeDeleteConfirmation();
  };

  closeDeleteConfirmation = () => {
    this.variableToDelete = undefined;
    this.isDeleteConfirmationOpen = false;
  };

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
    this.variables.retry();
  };

  onSortChange = (newSort: string) => {
    this.sort = newSort;
    this.variables.retry();
  };

  <template>
    {{#if this.codelists.isResolved}}
      <ReactiveTable
        @content={{this.variablesNotDeleted}}
        @isLoading={{this.variables.isLoading}}
        @noDataMessage={{t 'variable-manager.no-data'}}
        @page={{this.pageNumber}}
        @pageSize={{this.pageSize}}
        @onPageChange={{this.onPageChange}}
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
          <header.Sortable
            @field='createdOn'
            @label={{t 'utility.created-on'}}
          />
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
            {{#if variable.createdOn}}
              {{humanFriendlyDate variable.createdOn}}
            {{/if}}
          </td>
          <td>
            <AuButton
              @skin='naked'
              @icon='pencil'
              {{on 'click' (fn this.startEditVariable variable)}}
            />
            <AuButton
              @skin='naked'
              @alert={{true}}
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
          {{#if (and this.variableToEdit.isNew (not this.variableToDelete))}}
            {{t 'utility.add-variable'}}
          {{else}}
            {{t 'variable-manager.edit-modal-title'}}
          {{/if}}
        </:title>
        <:body>
          <div>
            <AuLabel
              @error={{isSome (get this.variableToEdit.error 'label')}}
              @required={{true}}
              @requiredLabel={{t 'utility.required'}}
            >{{t 'utility.variable'}}
            </AuLabel>

            <AuInput
              value={{this.variableToEdit.label}}
              @error={{isSome (get this.variableToEdit.error 'label')}}
              {{on 'input' this.setVariableLabel}}
            />
            <ErrorMessage @error={{get this.variableToEdit.error 'label'}} />
            <AuLabel
              @error={{isSome (get this.variableToEdit.error 'type')}}
              @required={{true}}
              @requiredLabel={{t 'utility.required'}}
            >{{t 'utility.type'}}
            </AuLabel>
            <div
              class={{if
                (get this.variableToEdit.error 'type')
                'ember-power-select--error'
              }}
            >
              <PowerSelect
                @allowClear={{false}}
                @searchEnabled={{false}}
                @options={{this.variableTypes}}
                @loadingMessage={{t 'utility.loading'}}
                @selected={{this.variableToEdit.type}}
                @onChange={{this.setVariableType}}
                as |type|
              >
                {{this.labelForType type}}
              </PowerSelect>
              <ErrorMessage @error={{get this.variableToEdit.error 'type'}} />
            </div>
            {{#if (isCodelistVariable this.variableToEdit)}}
              {{#let
                (getPromiseState this.variableToEdit.codeList)
                as |codelistPromise|
              }}
                {{#if codelistPromise.isSuccess}}
                  <PowerSelect
                    @triggerClass='au-u-margin-top-tiny'
                    @allowClear={{false}}
                    @searchEnabled={{true}}
                    {{! @glint-expect-error codelists should be resolved here }}
                    @options={{this.codelists.value}}
                    @selected={{or this.editedCodelist codelistPromise.value}}
                    @onChange={{this.updateCodelist}}
                    as |codeList|
                  >
                    {{codeList.label}}
                  </PowerSelect>
                  {{#let
                    (or this.editedCodelist codelistPromise.value)
                    as |selectedCodelist|
                  }}
                    {{#if selectedCodelist}}
                      {{#let
                        (getPromiseState selectedCodelist.concepts)
                        as |conceptsPromise|
                      }}
                        {{#if conceptsPromise.isSuccess}}
                          <ul
                            class='au-c-list-help au-c-help-text au-c-help-text--secondary'
                          >
                            {{#each conceptsPromise.value as |option|}}
                              <li
                                class='au-c-list-help__item'
                              >{{option.label}}</li>
                            {{/each}}
                          </ul>
                        {{/if}}
                      {{/let}}
                    {{/if}}
                  {{/let}}
                {{/if}}
                <ErrorMessage
                  @error={{get this.variableToEdit.error 'codelist'}}
                />
              {{/let}}
            {{/if}}
          </div>
          <AuLabel
            @error={{isSome (get this.variableToEdit.error 'required')}}
            @requiredLabel={{t 'utility.required'}}
          >{{t 'utility.required'}}
          </AuLabel>
          <AuCheckbox
            @checked={{this.variableToEdit.required}}
            @onChange={{this.toggleVariableRequired}}
          >
            {{t 'utility.required'}}
          </AuCheckbox>
        </:body>
        <:footer>
          <AuButton {{on 'click' this.saveVariable}}>
            {{t 'utility.save'}}
          </AuButton>
          <AuButton
            @skin='secondary'
            {{on 'click' this.closeEditVariableModal}}
          >
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
          <AuButton
            @skin='secondary'
            {{on 'click' this.closeDeleteConfirmation}}
          >
            {{t 'utility.cancel'}}
          </AuButton>
        </:footer>
      </AuModal>
    {{/if}}
  </template>
}
