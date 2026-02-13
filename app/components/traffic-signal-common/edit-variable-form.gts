import Component from '@glimmer/component';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import { isSome } from 'mow-registry/utils/option';
import { get } from '@ember/helper';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import { on } from '@ember/modifier';
import ErrorMessage from '../error-message';
import t from 'ember-intl/helpers/t';
import PowerSelect from 'ember-power-select/components/power-select';
import CodelistVariable, {
  isCodelistVariable,
} from 'mow-registry/models/codelist-variable';
import { Await, getPromiseState } from '@warp-drive/ember';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { fn } from '@ember/helper';
import { and, not, or } from 'ember-truth-helpers';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import type DateVariable from 'mow-registry/models/date-variable';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import TextVariable, {
  isTextVariable,
} from 'mow-registry/models/text-variable';
import NumberVariable, {
  isNumberVariable,
} from 'mow-registry/models/number-variable';
import { isDateVariable } from 'mow-registry/models/date-variable';
import Variable, {
  signVariableTypes,
  type SignVariableType,
  type VariableType,
} from 'mow-registry/models/variable';
import { uniqueId } from '@ember/helper';
import { cached, tracked } from '@glimmer/tracking';
import type Store from 'mow-registry/services/store';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type CodeList from 'mow-registry/models/code-list';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import type CodelistsService from 'mow-registry/services/codelists';
import type VariablesService from 'mow-registry/services/variables-service';
import { task } from 'ember-concurrency';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { recordIdentifierFor } from '@warp-drive/core';
import { trackedFunction } from 'reactiveweb/function';
import type CodeListValue from 'mow-registry/models/code-list-value';
import type { RelatedCollection } from '@warp-drive/core/store/-private';

interface Sig {
  Args: {
    variable: Variable;
    goBack: () => void;
    goToEditCodelist: (codelist?: CodeList) => void;
  };
}

export default class EditVariableForm extends Component<Sig> {
  @tracked variableToDelete?: Variable;
  variableToEditReplaced?: Variable;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare store: Store;
  @service declare variablesService: VariablesService;
  get variableToEdit() {
    return this.variableToEditReplaced || this.args.variable;
  }
  setVariableLabel = (event: Event) => {
    if (!this.variableToEdit) {
      return;
    }
    const newLabel = (event.target as HTMLInputElement).value;
    this.variableToEdit.label = newLabel;
  };
  get variableTypes() {
    return signVariableTypes;
  }
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
    this.variableToEditReplaced = newVar;
  };

  updateCodelist = (codeList: CodeList) => {
    if (isCodelistVariable(this.variableToEdit)) {
      this.variableToEdit.set('codeList', codeList);
      this.variableToEdit.set('defaultValue', null);
    }
  };
  saveVariable = task(async () => {
    const valid = await this.variableToEdit?.validate();
    if (!valid) return;
    if (this.variableToEdit) {
      await this.store.request(saveRecord(this.variableToEdit));
    }
    await this.variableToDelete?.destroyRecord();
    this.args.goBack();
  });

  cancelEditVariable = () => {
    if (this.saveVariable.isRunning) {
      return;
    }
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
    this.args.goBack();
  };
  labelForType = (variableType: VariableType) => {
    return this.variablesService.defaultLabelForVariableType(variableType);
  };
  codelists = trackedFunction(this, async () => {
    return await this.codeListService.all.perform();
  });

  orderConcepts = (concepts: RelatedCollection<SkosConcept>) => {
    const codelistValues = Array.from(concepts) as unknown as CodeListValue[];
    console.log(codelistValues);
    return codelistValues.sort((a, b) => {
      let positionA = a.position;
      let positionB = b.position;
      if (positionA === undefined) positionA = Number.MAX_VALUE;
      if (positionB === undefined) positionB = Number.MAX_VALUE;
      return positionA - positionB;
    });
  };

  <template>
    <AuModal @modalOpen={{true}} @closeModal={{@goBack}} @overflow={{true}}>
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
            <AuFormRow>
              <Await @promise={{this.variableToEdit.codeList}}>
                <:success as |codelist|>
                  <AuLabel
                    @required={{true}}
                    @requiredLabel={{t 'utility.required'}}
                  >{{t 'variable-manager.edit-modal.codelist'}}</AuLabel>
                  <PowerSelect
                    class='au-u-1-1'
                    @triggerClass='au-u-margin-top-tiny'
                    @allowClear={{false}}
                    @searchEnabled={{true}}
                    @searchField='label'
                    @options={{or this.codelists.value undefined}}
                    @selected={{codelist}}
                    @onChange={{this.updateCodelist}}
                    as |codeList|
                  >
                    {{codeList.label}}
                  </PowerSelect>
                  {{#if codelist}}
                    <Await @promise={{codelist.concepts}}>
                      <:success as |concepts|>
                        <div
                          class='au-c-list-help au-c-help-text au-c-help-text--secondary au-u-1-1'
                        >
                          <div class='au-u-flex au-u-flex--end'>
                            <AuButton
                              @icon='pencil'
                              @skin='link'
                              {{on 'click' (fn @goToEditCodelist codelist)}}
                            >{{t 'variable-manager.edit-codelist'}}</AuButton>
                          </div>
                          <ul>

                            {{#each (this.orderConcepts concepts) as |option|}}
                              <li
                                class='au-c-list-help__item'
                              >{{option.label}}</li>
                            {{/each}}
                          </ul>
                        </div>
                      </:success>
                    </Await>
                  {{/if}}
                  <p>
                    {{t 'variable-manager.no-codelist-found-question'}}
                    <AuButton
                      @skin='link'
                      {{on 'click' (fn @goToEditCodelist undefined)}}
                    >{{t 'variable-manager.new-codelist'}}</AuButton>
                  </p>
                </:success>
              </Await>
              <ErrorMessage
                @error={{get this.variableToEdit.error 'codelist'}}
              />
            </AuFormRow>

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
        <AuButton
          {{on 'click' this.saveVariable.perform}}
          @loading={{this.saveVariable.isRunning}}
        >
          {{t 'utility.save'}}
        </AuButton>
        <AuButton
          @skin='secondary'
          {{on 'click' this.cancelEditVariable}}
          @disabled={{this.saveVariable.isRunning}}
        >
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
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
    this.args.variable.defaultValue =
      defaultValue.length > 0 ? defaultValue : null;
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
    this.args.variable.defaultValue = !isNaN(defaultValue)
      ? defaultValue
      : null;
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
  get defaultValue() {
    return this.args.variable.defaultValue ?? undefined;
  }

  setDefaultValue = (_isoDate: string | null, date: Date | null) => {
    this.args.variable.defaultValue = date;
  };

  <template>
    <AuDatePicker
      @value={{this.defaultValue}}
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
            'in-scheme': {
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
        @searchField='label'
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
