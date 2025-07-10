import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import type { NamedRouteArgs } from '@ember/routing/lib/utils';
import { get } from '@ember/helper';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { task } from 'ember-concurrency';
// @ts-expect-error need EC v4 to get helper types...
import perform from 'ember-concurrency/helpers/perform';
// @ts-expect-error need to move to truth-helpers v4
import not from 'ember-truth-helpers/helpers/not';
// @ts-expect-error need to move to truth-helpers v4
import eq from 'ember-truth-helpers/helpers/eq';
// @ts-expect-error need to move to truth-helpers v4
import or from 'ember-truth-helpers/helpers/or';
import t from 'ember-intl/helpers/t';
import type IntlService from 'ember-intl/services/intl';
import PowerSelect from 'ember-power-select/components/power-select';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import type CodelistsService from 'mow-registry/services/codelists';
import type Template from 'mow-registry/models/template';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type Variable from 'mow-registry/models/variable';
import type CodeList from 'mow-registry/models/code-list';
import { validateVariables } from 'mow-registry/utils/validate-relations';
import { isSome } from 'mow-registry/utils/option';
import { removeItem } from 'mow-registry/utils/array';
import validateTemplateDates from 'mow-registry/utils/validate-template-dates';
import ErrorMessage from 'mow-registry/components/error-message';

export interface AddInstructionSig {
  Args: {
    concept: TrafficSignalConcept;
    editedTemplate: Template;
    closeInstructions: () => void;
    from: NamedRouteArgs[0];
  };
}

export default class AddInstructionComponent extends Component<AddInstructionSig> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare intl: IntlService;
  @tracked template?: Template;
  @tracked concept?: TrafficSignalConcept;
  @tracked variables?: Variable[];
  @tracked codeLists?: CodeList[];
  @tracked new?: boolean;
  @tracked inputTypes = ['text', 'number', 'date', 'location', 'codelist'];

  variablesToBeDeleted: Variable[] = [];

  @action
  async didInsert() {
    this.fetchData.perform();
  }

  fetchData = task(async () => {
    this.concept = await this.args.concept;
    this.codeLists = await this.codeListService.all.perform();

    if (this.args.editedTemplate) {
      this.new = false;
      this.template = await this.args.editedTemplate;
      this.variables = await this.template.variables;
      this.variables = this.variables
        .slice()
        .sort((a, b) => (a.id && b.id && a.id < b.id ? -1 : 1));
    } else {
      this.new = true;
      this.template = this.store.createRecord('template', {
        value: '',
      });
      this.variables = await this.template.variables;
    }
    this.parseTemplate();
  });

  @action
  async updateVariableType(variable: Variable, type: string) {
    variable.type = type;
    if (type === 'codelist' && !(await variable.codeList)) {
      variable.set('codeList', this.codeLists?.[0]);
    } else {
      variable.set('codeList', null);
    }
  }

  @action
  updateCodeList(variable: Variable, codeList: CodeList) {
    variable.set('codeList', codeList);
  }

  @action
  updateTemplate(event: Event) {
    if (this.template && event.target && 'value' in event.target) {
      this.template.value = event.target?.value as string;
      this.template.validateProperty('value');
      this.parseTemplate();
    }
  }

  get templateSyntaxError() {
    if (!this.template || !this.template.value) {
      return null;
    }
    // Regex which tests if variables in the template occur containing non-allowed characters:
    // (characters which are not: letters, numbers, '-', '.', '_', '}')
    const regex = new RegExp(/\${[^}]*?[^a-zA-Z\d\-_.}]+?[^}]*?}/g);
    const containsInvalidCharacters = regex.test(this.template.value);

    if (containsInvalidCharacters) {
      return {
        title: this.intl.t(
          'utility.template-variables.invalid-character.title',
        ),
        message: this.intl.t(
          'utility.template-variables.invalid-character.message',
        ),
      };
    }
    return null;
  }

  get canDelete() {
    return !this.new;
  }

  removeTemplate = task(async () => {
    const templates = await this.args.concept.hasInstructions;
    const template = this.args.editedTemplate;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.args.concept.save();

    this.router.replaceWith(this.args.from);
  });

  @action
  async setTemplateDate(
    attribute: 'startDate' | 'endDate',
    _isoDate: string | null,
    date: Date | null,
  ) {
    if (this.template && this.concept) {
      if (date && attribute === 'endDate') {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
      }
      if (date) {
        this.template.set(attribute, date);
      } else {
        this.template.set(attribute, undefined);
      }
      await this.template.validateProperty('startDate', {
        warnings: true,
      });
      await this.template.validateProperty('endDate', {
        warnings: true,
      });
      validateTemplateDates(this.template, this.concept);
    }
  }

  //only resetting things we got from parent component
  @action
  reset() {
    if (this.template?.hasDirtyAttributes || this.template?.isNew) {
      this.template.rollbackAttributes();
    }
    if (this.concept?.hasDirtyAttributes || this.concept?.isNew) {
      this.concept.rollbackAttributes();
    }
    if (this.args.closeInstructions) {
      this.args.closeInstructions();
    } else if (this.args.from) {
      this.router.transitionTo(this.args.from);
    }
  }

  @action
  parseTemplate() {
    //match "a-z", "A-Z", "-", "_", "." and "any digit characters" between ${ and } lazily
    const regex = new RegExp(/\${([a-zA-Z\-_.\d]+?)}/g);
    const regexResult = [...(this.template?.value?.matchAll(regex) || [])];

    //remove duplicates from regex result
    const filteredRegexResult: RegExpExecArray[] = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variable variables from current array
    //turns variables into a non ember data thing
    this.variables = this.variables?.filter((variable) => {
      //search regex results if they contain this variable
      if (
        filteredRegexResult.find((fReg) => {
          if (fReg[1] === variable.label) {
            return true;
          }
        })
      ) {
        return true;
      } else {
        this.variablesToBeDeleted.push(variable);
      }
    });

    //add new variables
    filteredRegexResult.forEach((reg) => {
      if (!this.variables?.find((variable) => variable.label === reg[1])) {
        const variable = this.store.createRecord<Variable>('variable', {
          label: reg[1],
          type: 'text',
        });
        this.variables?.push(variable);
      }
    });

    //remove duplicates in case something went wrong
    const filteredVariables: Variable[] = [];
    this.variables?.forEach((variable) => {
      if (
        !filteredVariables.find(
          (fVariable) => fVariable.label === variable.label,
        )
      ) {
        filteredVariables.push(variable);
      } else {
        this.variablesToBeDeleted.push(variable);
      }
    });

    //sort variables in the same order as the regex result
    const sortedVariables: Variable[] = [];
    filteredRegexResult.forEach((reg) => {
      filteredVariables.forEach((variable) => {
        if (reg[1] == variable.label) {
          sortedVariables.push(variable);
        }
      });
    });

    //check existing default variables with deleted non-default variables and swap them
    sortedVariables.forEach((sVariable, sI) => {
      this.variablesToBeDeleted.forEach((dVariable, dI) => {
        if (sVariable.label === dVariable.label) {
          if (dVariable.type !== 'text' && sVariable.type === 'text') {
            sortedVariables.splice(sI, 1, dVariable);
            this.variablesToBeDeleted.splice(dI, 1, sVariable);
          }
        }
      });
    });

    this.variables = sortedVariables;
  }

  get canSave() {
    return (
      !this.save.isRunning && !this.templateSyntaxError && !this.template?.error
    );
  }

  save = task(async () => {
    if (this.template && this.concept && this.variables) {
      const isValid = await this.template.validate();
      const areVariablesValid = await validateVariables(this.variables);

      if (isValid && areVariablesValid && !this.templateSyntaxError) {
        await this.template.save();
        (await this.concept.hasInstructions).push(this.template);
        await this.concept.save();
        for (let i = 0; i < this.variables.length; i++) {
          const variable = this.variables[i];
          if (variable) {
            (await this.template.variables).push(variable);
            await variable.save();
          }
        }
        await this.template.save();
        await Promise.all(
          this.variablesToBeDeleted.map((variable) => variable.destroyRecord()),
        );

        this.reset();
      }
    }
  });

  <template>
    <div>
      <AuToolbar @size='large' as |Group|>
        <Group>
          <AuHeading @level='2' @skin='3'>
            {{#if this.new}}
              {{t 'utility.add-instruction'}}
            {{else}}
              {{t 'utility.edit-instruction'}}
            {{/if}}
          </AuHeading>
        </Group>

        <Group>
          <AuButtonGroup>
            <AuButton
              {{on 'click' (perform this.save)}}
              @disabled={{not this.canSave}}
              @loading={{this.save.isRunning}}
              @loadingMessage={{t 'utility.save'}}
            >
              {{t 'utility.save'}}
            </AuButton>
            <AuButton @skin='secondary' {{on 'click' this.reset}}>
              {{t 'utility.cancel'}}
            </AuButton>
            {{#if this.canDelete}}
              <AuButton
                @skin='secondary'
                @alert={{true}}
                @loading={{this.removeTemplate.isRunning}}
                @loadingMessage={{t 'utility.delete'}}
                {{on 'click' this.removeTemplate.perform}}
              >
                {{t 'utility.delete'}}
              </AuButton>
            {{/if}}
          </AuButtonGroup>
        </Group>
      </AuToolbar>

      <div class='au-o-box'>
        <div class='au-o-grid'>
          <div
            class='au-o-grid__item au-u-1-2@medium'
            {{! TODO: refactor did-insert}}
            {{didInsert this.didInsert}}
          >
            <AuFormRow>
              {{#let (get this.template.error 'value') as |error|}}
                <AuLabel
                  for='textarea-description'
                  @error={{isSome error}}
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >{{t 'utility.description'}}
                </AuLabel>
                <AuTextarea
                  {{on 'input' this.updateTemplate}}
                  id='textarea-description'
                  required
                  @error={{isSome error}}
                  @width='block'
                  value={{this.template.value}}
                  class='u-min-h-20'
                />
                <ErrorMessage @error={{error}} />
              {{/let}}
              {{#if this.templateSyntaxError}}
                <AuAlert
                  @title={{this.templateSyntaxError.title}}
                  @skin='error'
                  @icon='alert-triangle'
                  class='au-u-margin-top-small'
                >
                  {{this.templateSyntaxError.message}}
                </AuAlert>
              {{/if}}
            </AuFormRow>
            {{#let (get this.template.error 'startDate') as |error|}}
              {{#let (get this.template.warning 'startDate') as |warning|}}
                <AuFormRow>
                  <AuLabel
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    for='startDate'
                  >
                    {{t 'utility.start-date'}}&nbsp;
                  </AuLabel>
                  <AuDatePicker
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    id='startDate'
                    @value={{this.template.startDate}}
                    @onChange={{fn this.setTemplateDate 'startDate'}}
                  />
                  <ErrorMessage @error={{error}} @warning={{warning}} />
                </AuFormRow>
              {{/let}}
            {{/let}}
            {{#let (get this.template.error 'endDate') as |error|}}
              {{#let (get this.template.warning 'endDate') as |warning|}}
                <AuFormRow>
                  <AuLabel
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    for='endDate'
                  >
                    {{t 'utility.end-date'}}&nbsp;
                  </AuLabel>
                  <AuDatePicker
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    id='endDate'
                    @min={{this.template.startDate}}
                    @value={{this.template.endDate}}
                    @onChange={{fn this.setTemplateDate 'endDate'}}
                  />
                  <ErrorMessage @error={{error}} @warning={{warning}} />
                </AuFormRow>
              {{/let}}
            {{/let}}
          </div>

          <div
            class='au-o-grid__item au-u-1-2@medium'
            style='margin-top: 30px;'
            {{! template-lint-disable no-inline-styles }}
          >
            <AuTable
              style='min-width: unset;'
              {{! template-lint-disable no-inline-styles }}
            >
              <:header>
                <tr>
                  <th class='w-px'>{{t
                      'traffic-measure-concept.attr.variable'
                    }}</th>
                  <th>{{t 'traffic-measure-concept.attr.type'}}</th>
                </tr>
              </:header>
              <:body>
                {{#each this.variables as |variable|}}
                  <tr>
                    <td>{{variable.label}}</td>
                    <td>
                      {{! @glint-expect-error need to move to PS 8 }}
                      <PowerSelect
                        {{! @glint-expect-error need to move to PS 8 }}
                        @allowClear={{false}}
                        @searchEnabled={{false}}
                        @options={{this.inputTypes}}
                        @selected={{variable.type}}
                        @onChange={{fn this.updateVariableType variable}}
                        as |type|
                      >
                        {{type}}
                      </PowerSelect>
                      {{#if (eq variable.type 'codelist')}}
                        {{! @glint-expect-error need to move to PS 8 }}
                        <PowerSelect
                          @allowClear={{false}}
                          @searchEnabled={{false}}
                          {{! @glint-expect-error need to move to PS 8 }}
                          @options={{this.codeLists}}
                          @selected={{variable.codeList}}
                          @onChange={{fn this.updateCodeList variable}}
                          as |codeList|
                        >
                          {{codeList.label}}
                        </PowerSelect>
                        <ul>
                          {{#each
                            (or (get variable.codeList 'concepts'))
                            as |option|
                          }}
                            <li> - {{option.label}}</li>
                          {{/each}}
                        </ul>
                      {{/if}}
                    </td>
                  </tr>
                {{else}}
                  <tr>
                    <td colspan='2'>
                      <AuHelpText @skin='secondary'>
                        {{t 'utility.template-variables.no-variables'}}
                      </AuHelpText>
                    </td>
                  </tr>
                {{/each}}
              </:body>
            </AuTable>
          </div>
        </div>
      </div>
    </div>
  </template>
}
