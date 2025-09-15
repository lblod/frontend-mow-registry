import { cached, tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';
import Variable, {
  signVariableTypes,
  type SignVariableType,
} from 'mow-registry/models/variable';
import type CodelistsService from 'mow-registry/services/codelists';
import type Store from 'mow-registry/services/mow-store';
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
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import { recordIdentifierFor } from '@ember-data/store';
import CodelistVariable, {
  isCodelistVariable,
} from 'mow-registry/models/codelist-variable';
import { and, not, or } from 'ember-truth-helpers';
import { get } from '@ember/helper';
import { isSome } from 'mow-registry/utils/option';
import TextVariable, {
  isTextVariable,
} from 'mow-registry/models/text-variable';
import DateVariable, {
  isDateVariable,
} from 'mow-registry/models/date-variable';
import NumberVariable, {
  isNumberVariable,
} from 'mow-registry/models/number-variable';
import { uniqueId } from '@ember/helper';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import SkosConcept from 'mow-registry/models/skos-concept';
import type IntlService from 'ember-intl/services/intl';

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
    const { pageNumber, pageSize, sort } = this;
    const trafficSignalId = this.args.trafficSignal.id;
    await Promise.resolve();
    const variables = await this.store.query<Variable>('variable', {
      'filter[trafficSignalConcept][:id:]': trafficSignalId,
      page: {
        number: pageNumber,
        size: pageSize,
      },
      sort: sort,
    });
    return variables;
  });

  startAddVariable = () => {
    this.isEditVariableModalOpen = true;
    this.variableToEdit = this.store.createRecord<Variable>('text-variable', {
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

  saveVariable = async () => {
    const valid = await this.variableToEdit?.validate();
    if (!valid) return;
    await this.variableToEdit?.save();
    await this.variableToDelete?.destroyRecord();
    this.variables.retry();
    this.closeEditVariableModal();
  };

  cancelEditVariable = async () => {
    if (this.variableToEdit) {
      this.store.cache.rollbackRelationships(
        recordIdentifierFor(this.variableToEdit),
      );
      this.store.cache.rollbackAttrs(recordIdentifierFor(this.variableToEdit));
      if (this.variableToEdit.isNew) {
        this.variableToEdit.unloadRecord();
      }
    }
    if (this.variableToDelete) {
      this.store.cache.rollbackRelationships(
        recordIdentifierFor(this.variableToDelete),
      );
      this.store.cache.rollbackAttrs(
        recordIdentifierFor(this.variableToDelete),
      );
    }
    this.closeEditVariableModal();
  };

  closeEditVariableModal = () => {
    this.variableToEdit = undefined;
    this.variableToDelete = undefined;
    this.isEditVariableModalOpen = false;
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
    if (isCodelistVariable(this.variableToEdit)) {
      this.variableToEdit.set('codeList', codeList);
    }
  };

  startDeleteVariableFlow = (variable: Variable) => {
    this.variableToDelete = variable;
    this.isDeleteConfirmationOpen = true;
  };

  removeVariable = async () => {
    await this.variableToDelete?.destroyRecord();
    this.variables.retry();
    this.closeDeleteConfirmation();
  };

  closeDeleteConfirmation = () => {
    this.variableToDelete = undefined;
    this.isDeleteConfirmationOpen = false;
  };

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
  };

  onSortChange = (newSort: string) => {
    this.sort = newSort;
  };

  <template>
    {{#if this.codelists.isResolved}}
      <ReactiveTable
        @content={{this.variables.value}}
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
        @overflow={{true}}
      >
        <:title>
          {{#if (and this.variableToEdit.isNew (not this.variableToDelete))}}
            {{t 'utility.add-variable'}}
          {{else}}
            {{t 'variable-manager.edit-modal.title'}}
          {{/if}}
        </:title>
        <:body>
          <div class='au-o-flow--small'>
            <AuFormRow>
              <AuLabel
                @error={{isSome (get this.variableToEdit.error 'label')}}
                @required={{true}}
                @requiredLabel={{t 'utility.required'}}
              >{{t 'utility.variable'}}
              </AuLabel>
              <AuInput
                @width='block'
                value={{this.variableToEdit.label}}
                @error={{isSome (get this.variableToEdit.error 'label')}}
                {{on 'input' this.setVariableLabel}}
              />
              <ErrorMessage @error={{get this.variableToEdit.error 'label'}} />
            </AuFormRow>
            <AuFormRow>
              <AuLabel
                @error={{isSome (get this.variableToEdit.error 'type')}}
                @required={{true}}
                @requiredLabel={{t 'utility.required'}}
              >{{t 'utility.type'}}
              </AuLabel>
              <div
                class='{{if
                    (get this.variableToEdit.error "type")
                    "ember-power-select--error"
                  }}
                  au-u-1-1'
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
            </AuFormRow>
            {{#if (isCodelistVariable this.variableToEdit)}}
              {{#let
                (getPromiseState this.variableToEdit.codeList)
                as |codelistPromise|
              }}
                <AuFormRow>
                  {{#if codelistPromise.isSuccess}}
                    <AuLabel>{{t
                        'variable-manager.edit-modal.codelist'
                      }}</AuLabel>
                    <PowerSelect
                      class='au-u-1-1'
                      @triggerClass='au-u-margin-top-tiny'
                      @allowClear={{false}}
                      @searchEnabled={{true}}
                      @options={{or this.codelists.value undefined}}
                      @selected={{codelistPromise.value}}
                      @onChange={{this.updateCodelist}}
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
                            class='au-c-list-help au-c-help-text au-c-help-text--secondary au-u-1-1'
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
                  {{/if}}
                  <ErrorMessage
                    @error={{get this.variableToEdit.error 'codelist'}}
                  />
                </AuFormRow>
              {{/let}}
            {{/if}}
            <AuFormRow>
              {{#if this.variableToEdit}}
                <VariableDefaultValueSelector
                  class='au-u-1-1'
                  @variable={{this.variableToEdit}}
                />
              {{/if}}
            </AuFormRow>
            <AuFormRow>
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
            </AuFormRow>
          </div>
        </:body>
        <:footer>
          <AuButton {{on 'click' this.saveVariable}}>
            {{t 'utility.save'}}
          </AuButton>
          <AuButton @skin='secondary' {{on 'click' this.cancelEditVariable}}>
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

class VariableDefaultValueSelector extends Component<{
  Args: { variable: Variable };
  Element: HTMLDivElement;
}> {
  @service declare intl: IntlService;

  get shouldShow() {
    const variable = this.args.variable;
    return (
      isTextVariable(variable) ||
      isNumberVariable(variable) ||
      isDateVariable(variable) ||
      isCodelistVariable(variable)
    );
  }

  <template>
    {{#if this.shouldShow}}
      <div ...attributes>
        {{#let (uniqueId) as |id|}}
          <AuLabel for={{id}}>{{t
              'variable-manager.edit-modal.default-value.label'
            }}</AuLabel>
          {{#if (isTextVariable @variable)}}
            <TextVariableDefaultValueSelector @variable={{@variable}} />
          {{else if (isNumberVariable @variable)}}
            <NumberVariableDefaultValueSelector @variable={{@variable}} />
          {{else if (isDateVariable @variable)}}
            <DateVariableDefaultValueSelector @variable={{@variable}} />
          {{else if (isCodelistVariable @variable)}}
            <CodelistVariableDefaultValueSelector @variable={{@variable}} />
          {{/if}}
        {{/let}}
      </div>
    {{/if}}
  </template>
}

class TextVariableDefaultValueSelector extends Component<{
  variable: TextVariable;
  placeholder?: string;
}> {
  setDefaultValue = (event: Event) => {
    const defaultValue = (event.target as HTMLInputElement).value;
    this.args.variable.defaultValue = defaultValue;
  };

  <template>
    <AuInput
      @width='block'
      {{on 'input' this.setDefaultValue}}
      value={{@variable.defaultValue}}
      placeholder={{t
        'variable-manager.edit-modal.default-value.placeholder.free-text'
      }}
    />
  </template>
}

class NumberVariableDefaultValueSelector extends Component<{
  variable: NumberVariable;
  placeholder?: string;
}> {
  setDefaultValue = (event: Event) => {
    const defaultValue = (event.target as HTMLInputElement).valueAsNumber;
    this.args.variable.defaultValue = defaultValue;
  };

  <template>
    <AuInput
      @width='block'
      type='number'
      {{on 'input' this.setDefaultValue}}
      value={{@variable.defaultValue}}
      placeholder={{t
        'variable-manager.edit-modal.default-value.placeholder.free-text'
      }}
    />
  </template>
}

class DateVariableDefaultValueSelector extends Component<{
  variable: DateVariable;
}> {
  setDefaultValue = (_isoDate: string | null, date: Date | null) => {
    this.args.variable.defaultValue = date ?? undefined;
  };

  <template>
    <AuDatePicker
      @value={{@variable.defaultValue}}
      @onChange={{this.setDefaultValue}}
    />
  </template>
}

class CodelistVariableDefaultValueSelector extends Component<{
  variable: CodelistVariable;
  placeholder?: string;
}> {
  @service declare store: Store;

  @cached
  get codelist() {
    return getPromiseState(this.args.variable.codeList);
  }

  @cached
  get defaultValue() {
    return getPromiseState(this.args.variable.defaultValue);
  }

  @cached
  get codelistOptionsPromise(): Promise<readonly SkosConcept[]> {
    return (async () => {
      if (!this.codelist.isSuccess || !this.codelist.value) {
        return [] as SkosConcept[];
      }
      const codelistUri = this.codelist.value.uri!;
      await Promise.resolve();
      const concepts = await this.store.countAndFetchAll<SkosConcept>(
        'skos-concept',
        {
          filter: {
            inScheme: {
              ':uri:': codelistUri,
            },
          },
        },
      );
      return concepts.slice() as SkosConcept[];
    })();
  }

  setDefaultValue = (codelistOption: SkosConcept) => {
    this.args.variable.set('defaultValue', codelistOption);
  };

  get enabled() {
    if (this.codelist.isPending || this.codelist.isError) {
      return false;
    }
    return Boolean(this.codelist.value);
  }

  <template>
    {{#if this.defaultValue.isSuccess}}
      <PowerSelect
        @searchEnabled={{true}}
        @searchField="label"
        @options={{this.codelistOptionsPromise}}
        @selected={{this.defaultValue.value}}
        @allowClear={{true}}
        @onChange={{this.setDefaultValue}}
        @disabled={{not this.enabled}}
        @loadingMessage={{t 'utility.loading'}}
        @placeholder={{t
          'variable-manager.edit-modal.default-value.placeholder.select'
        }}
        as |option|
      >
        {{option.label}}
      </PowerSelect>
    {{/if}}
  </template>
}
