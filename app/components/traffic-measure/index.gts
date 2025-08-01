import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import { fn, get } from '@ember/helper';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
// @ts-expect-error need EC v4 to get helper types...
import perform from 'ember-concurrency/helpers/perform';
import { or } from 'ember-truth-helpers';
import t from 'ember-intl/helpers/t';
import { TrackedArray } from 'tracked-built-ins';
import type IntlService from 'ember-intl/services/intl';
import load from 'ember-async-data/helpers/load';
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
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import CodelistsService from 'mow-registry/services/codelists';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import Template from 'mow-registry/models/template';
import { isSome, type Option, unwrap } from 'mow-registry/utils/option';
import CodeList from 'mow-registry/models/code-list';
import type { SignType } from 'mow-registry/components/traffic-measure/select-type';
import Variable, {
  allVariableTypes,
  signVariableTypes,
  type VariableType,
} from 'mow-registry/models/variable';
import { removeItem } from 'mow-registry/utils/array';
import validateTrafficMeasureDates from 'mow-registry/utils/validate-traffic-measure-dates';
import type SkosConcept from 'mow-registry/models/skos-concept';
import { isCodelistVariable } from 'mow-registry/models/codelist-variable';
import ValidationStatus from 'mow-registry/components/validation-status';
import ErrorMessage from 'mow-registry/components/error-message';
import ContentCheck from 'mow-registry/components/content-check';
import ZonalitySelector from 'mow-registry/components/zonality-selector';
import VariableSignageSelector from 'mow-registry/components/variable-signage-selector';
import TrafficMeasureSelectType from 'mow-registry/components/traffic-measure/select-type';
import truncate from 'mow-registry/helpers/truncate';
import TrafficMeasureAddSign from 'mow-registry/components/traffic-measure/add-sign';
import TrafficMeasureSignList from 'mow-registry/components/traffic-measure/sign-list';
import TrafficMeasurePreview from 'mow-registry/components/traffic-measure/preview';
import type VariablesService from 'mow-registry/services/variables-service';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import { isInstructionVariable } from 'mow-registry/models/instruction-variable';
import type TextVariable from 'mow-registry/models/text-variable';
import { validateVariables } from 'mow-registry/utils/validate-relations';

type Sig = {
  Args: {
    trafficMeasureConcept: TrafficMeasureConcept;
  };
  Blocks: {
    title: [];
  };
};

export default class TrafficMeasureIndexComponent extends Component<Sig> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare variablesService: VariablesService;

  @tracked codeLists: CodeList[] = [];
  @tracked signs: TrafficSignalListItem[] = [];
  @tracked variables: Variable[] = [];
  @tracked template?: Template | null;
  @tracked searchString?: string;
  @tracked preview?: string;
  @tracked selectedType?: SignType | null;
  @tracked instructions: Template[] = [];
  @tracked signsError = false;
  @tracked signValidation?: string | null;

  variablesToBeDeleted: Variable[] = [];

  get variableTypes(): VariableType[] {
    return this.instructions.length > 0 ? allVariableTypes : signVariableTypes;
  }

  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.signValidation,
    );
  }

  @action
  async updateZonality(zonality: SkosConcept) {
    this.args.trafficMeasureConcept.set('zonality', zonality);
    await this.args.trafficMeasureConcept.validateProperty('zonality');
  }

  @action
  updateValidationFilter(
    selectedOption: (typeof this.validationStatusOptions)[number],
  ) {
    if (selectedOption) {
      this.signValidation = selectedOption.value;
    } else {
      this.signValidation = null;
    }
  }

  @action
  async didInsert() {
    await this.fetchData.perform();
  }

  get new() {
    return this.args.trafficMeasureConcept?.isNew;
  }

  get previewHtml() {
    return this.preview ? htmlSafe(this.preview) : null;
  }

  get isSelectedTypeEmpty() {
    return !this.selectedType;
  }

  fetchData = task(async () => {
    // Wait for data loading
    const relatedTrafficSignals =
      await this.args.trafficMeasureConcept.relatedTrafficSignalConceptsOrdered;

    this.codeLists = await this.codeListService.all.perform();

    // We assume that a measure has only one template
    this.template = await this.args.trafficMeasureConcept.template;
    if (this.template) {
      this.variables = (await this.template.variables).slice().sort((a, b) => {
        if (a.id && b.id) {
          return a.id < b.id ? -1 : 1;
        } else {
          return 0;
        }
      });
    }

    this.signs = new TrackedArray(relatedTrafficSignals);
    this.signs.sort((a, b) => (a.position ?? -1) - (b.position ?? -1));

    await this.fetchInstructions.perform();

    await this.parseTemplate();
  });

  fetchInstructions = task(async () => {
    //refresh instruction list from available signs
    const instructions: Template[] = [];
    for (let i = 0; i < this.signs.length; i++) {
      const sign = await this.signs[i]?.item;
      if (sign) {
        const signInstructions = await sign.hasInstructions;
        signInstructions.forEach((instr) => instructions.push(instr));
      }
    }

    this.instructions = instructions;

    //remove input type instruction if there are none available and reset variables with instructions
    if (instructions.length == 0) {
      for (let i = 0; i < this.variables.length; i++) {
        const variable = this.variables[i];
        if (variable && isInstructionVariable(variable)) {
          await this.updateVariableType(i, variable, 'text');
        }
      }
    }
  });

  @action
  async updateCodelist(variable: Variable, codeList: CodeList) {
    if (isCodelistVariable(variable)) {
      variable.set('codeList', codeList);
      await this.generatePreview.perform();
    }
  }

  @action
  async updateInstruction(variable: Variable, template: Template) {
    if (isInstructionVariable(variable)) {
      variable.set('template', template);
      await this.generatePreview.perform();
    }
  }

  @action
  async addSign(sign: TrafficSignalListItem) {
    this.signs.push(sign);
    (
      await this.args.trafficMeasureConcept.relatedTrafficSignalConceptsOrdered
    ).push(sign);
    await this.fetchInstructions.perform();
    this.selectedType = null;
  }

  @action
  async removeSign(sign: TrafficSignalListItem) {
    removeItem(this.signs, sign);
    removeItem(
      await this.args.trafficMeasureConcept.relatedTrafficSignalConceptsOrdered,
      sign,
    );
    await this.fetchInstructions.perform();
  }

  @action
  sortSigns(signs: TrafficSignalListItem[]) {
    for (let i = 0; i < signs.length; i++) {
      const sign = signs[i];
      if (sign && sign.position !== i) {
        sign.position = i;
      }
    }
    this.signs = new TrackedArray(signs);
  }

  @action
  async updateTemplate(event: Event) {
    if (this.template) {
      this.template.value = (event.target as HTMLInputElement).value;
      await this.template.validate();
    }
  }

  @action
  updateTypeFilter(selectedType: SignType) {
    if (selectedType) {
      this.selectedType = selectedType;
    } else {
      this.selectedType = null;
    }
  }

  @action
  updateVariableRequired(variable: Variable) {
    variable.set('required', !variable.required);
  }

  @action
  async updateVariableType(
    varIndex: number,
    existing: Variable,
    selectedType: VariableType,
  ) {
    const newVar = this.variablesService.convertVariableType(
      existing,
      selectedType,
    );
    const newVars = [...this.variables];
    this.variablesToBeDeleted.push(
      ...newVars.splice(varIndex, 1, newVar as Variable),
    );
    this.variables = newVars;
    await this.generatePreview.perform();
  }

  //parsing algo that keeps ui changes in tact
  @action
  async parseTemplate() {
    if (!this.template) {
      return;
    }
    //match "a-z", "A-Z", "-", "_", "." and "any digit characters" between ${ and } lazily
    const regex = new RegExp(/\${([a-zA-Z\-_.\d]+?)}/g);
    const regexResult = [...(this.template.value ?? '').matchAll(regex)];

    //remove duplicates from regex result
    const filteredRegexResult: RegExpMatchArray[] = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variable variables from current array
    //turns variables into a non ember data thing
    this.variables = this.variables.filter((variable) => {
      //search regex results if they contain this variable
      if (
        filteredRegexResult.find((fReg) => {
          if (fReg[1] === variable.label) {
            return true;
          } else {
            return false;
          }
        })
      ) {
        return true;
      } else {
        this.variablesToBeDeleted.push(variable);
        return false;
      }
    });

    //add new variable variables
    filteredRegexResult.forEach((reg) => {
      if (!this.variables.find((variable) => variable.label === reg[1])) {
        this.variables.push(
          this.store.createRecord<TextVariable>('text-variable' as 'variable', {
            label: reg[1],
          }) as Variable,
        );
      }
    });

    //remove duplicates in case something went wrong
    const filteredVariables: Variable[] = [];
    this.variables.forEach((variable) => {
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
            // sortedVariables.replace(sI, 1, [dVariable]);
            sortedVariables[sI] = dVariable;
            // this.variablesToBeDeleted.replace(dI, 1, [sVariable]);
            this.variablesToBeDeleted[dI] = sVariable;
          }
        }
      });
    });

    this.variables = sortedVariables;
    await this.generatePreview.perform();
  }

  generatePreview = task(async () => {
    if (!this.template) {
      return;
    }
    this.preview = this.template.value ?? '';

    for (const variable of this.variables) {
      let replaceString;
      if (isInstructionVariable(variable)) {
        const instruction = await variable.template;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction?.value ?? '') +
          '</span>';
        this.preview = this.preview.replaceAll(
          '${' + (variable.label ?? '') + '}',
          replaceString,
        );
      }
    }
  });

  save = task(async () => {
    // We assume a measure only has one template
    const template = unwrap(await this.args.trafficMeasureConcept.template);

    // Show custom error if no signs selected
    this.signsError = !this.signs.length;

    // Validate measure fields
    const isValid = await this.args.trafficMeasureConcept.validate();
    const isTemplateValid = await template.validate();
    const areVariablesValid = await validateVariables(this.variables);
    if (!isValid || !isTemplateValid || !areVariablesValid) {
      return;
    }

    // If there’s an error with the signs, return early to prevent the save from occurring
    if (this.signsError) return;

    //if new save relationships
    if (this.new) {
      await this.args.trafficMeasureConcept.save();
      await template.save();
      await this.args.trafficMeasureConcept.save();
    }

    //1-parse everything again
    await this.parseTemplate();

    //2-update roadsigns
    await this.saveRoadsigns.perform(this.args.trafficMeasureConcept);
    //3-update node shape

    let label = '';
    for (const signOrdered of this.signs) {
      const sign = await signOrdered.item;
      label = `${label}${sign?.label ?? ''}-`;
    }
    //get rid of the last dash
    label = label.slice(0, -1);
    this.args.trafficMeasureConcept.label = label;
    await this.args.trafficMeasureConcept.save();

    //4-handle variable variables
    await this.saveVariables.perform(template);

    // //5-annotate rdfa
    // await this.annotateRdfa.perform(template);

    this.router.transitionTo(
      'traffic-measure-concepts.details',
      this.args.trafficMeasureConcept.id,
    );
  });

  saveRoadsigns = task(async (trafficMeasureConcept: TrafficMeasureConcept) => {
    // delete existing ones
    const existingRelatedSigns = (
      await trafficMeasureConcept.relatedTrafficSignalConceptsOrdered
    ).slice();

    const deletedSigns = existingRelatedSigns.filter(
      (sign) => !this.signs.includes(sign),
    );
    const addedSigns = this.signs.filter(
      (sign) => !existingRelatedSigns.includes(sign),
    );

    for (const sign of deletedSigns) {
      sign.deleteRecord();
      await sign.save();
    }

    for (const sign of addedSigns) {
      await sign.save();
    }
  });

  saveVariables = task(async (template: Template) => {
    //destroy old ones
    await Promise.all(
      this.variablesToBeDeleted.map((variable) => variable.destroyRecord()),
    );

    //create new ones
    for (const variable of this.variables) {
      (await template.variables).push(variable);
      await variable.save();
    }

    await template.save();
  });

  willDestroy() {
    super.willDestroy();

    const wasNew = this.args.trafficMeasureConcept.isNew;
    this.template?.rollbackAttributes();
    for (const variable of this.variables) {
      variable.rollbackAttributes();
    }
    this.args.trafficMeasureConcept.rollbackAttributes();
    if (!wasNew) {
      void this.args.trafficMeasureConcept.belongsTo('zonality').reload();
    }
  }

  @action
  async setTrafficMeasureDate(
    attribute: string,
    _isoDate: Option<string>,
    date: Option<Date>,
  ) {
    if (date && attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    if (date) {
      this.args.trafficMeasureConcept.set(attribute, date);
    } else {
      this.args.trafficMeasureConcept.set(attribute, undefined);
    }
    await this.args.trafficMeasureConcept.validateProperty('startDate', {
      warnings: true,
    });
    await this.args.trafficMeasureConcept.validateProperty('endDate', {
      warnings: true,
    });
    void validateTrafficMeasureDates(this.args.trafficMeasureConcept);
  }

  getError = (
    type: 'error' | 'warning',
    obj: Option<TrafficMeasureConcept | Template>,
    key: string,
  ) => {
    const err = obj?.[type];
    if (err) {
      return err[key];
    }
  };

  <template>
    {{#if this.signsError}}
      <AuAlert @icon='alert-triangle' @skin='warning'>
        {{t 'utility.incomplete-measure-error'}}
      </AuAlert>
    {{/if}}
    <AuToolbar @border='bottom' @size='large' as |Group|>
      <Group class='au-u-flex--vertical-center'>
        {{yield to='title'}}
        <ValidationStatus @valid={{@trafficMeasureConcept.valid}} />
      </Group>
      <Group>
        <AuButtonGroup>
          <AuButton
            {{on 'click' (perform this.save)}}
            @loading={{if this.save.isRunning true false}}
            @loadingMessage={{t 'utility.save'}}
            @disabled={{or
              (isSome @trafficMeasureConcept.error)
              this.save.isRunning
            }}
          >
            {{t 'utility.save'}}
          </AuButton>

          {{#if @trafficMeasureConcept.isNew}}
            <AuLink @skin='button-secondary' @route='traffic-measure-concepts'>
              {{t 'utility.cancel'}}
            </AuLink>
          {{else}}
            <AuLink
              @skin='button-secondary'
              @route='traffic-measure-concepts.details'
              @model={{@trafficMeasureConcept.id}}
            >
              {{t 'utility.cancel'}}
            </AuLink>
          {{/if}}
        </AuButtonGroup>
      </Group>
    </AuToolbar>

    <div
      class='au-o-grid au-o-grid--flush au-o-grid--split'
      {{didInsert this.didInsert}}
      {{! TODO: refactor did-insert }}
      {{!template-lint-disable no-at-ember-render-modifiers}}
    >
      {{! template-lint-disable no-inline-styles }}
      <div class='au-o-grid__item au-u-1-2@medium'>
        <div
          class='au-o-box au-c-body-container au-c-body-container--scroll au-c-body-container--table'
        >
          <AuToolbar class='au-u-margin-bottom' as |Group|>
            <Group>
              <AuHeading @level='3' @skin='3'>
                {{!-- {{this.label}} --}}
                {{t 'utility.properties'}}
              </AuHeading>
            </Group>
            {{#unless @trafficMeasureConcept.isNew}}
              <Group>
                <ContentCheck @concept={{@trafficMeasureConcept}} />
              </Group>
            {{/unless}}
          </AuToolbar>
          <div class='au-o-grid'>
            <div class='au-o-grid__item au-u-1-2'>
              <AuHeading @level='4' @skin='4' class='au-u-margin-bottom-small'>
                {{t 'utility.zonality'}}
              </AuHeading>
              {{#let (load @trafficMeasureConcept.zonality) as |zonality|}}
                {{#if zonality.isResolved}}
                  <ZonalitySelector
                    @zonality={{zonality.value}}
                    @onChange={{this.updateZonality}}
                    @model={{@trafficMeasureConcept}}
                  />
                {{/if}}
              {{/let}}
            </div>
            <div class='au-o-grid__item au-u-1-2'>
              <AuHeading @level='4' @skin='4' class='au-u-margin-bottom-small'>
                {{t 'traffic-measure-concept.attr.variable-signage'}}
              </AuHeading>
              <VariableSignageSelector @concept={{@trafficMeasureConcept}} />
            </div>
          </div>
          {{#let
            (this.getError 'error' @trafficMeasureConcept 'startDate')
            (this.getError 'warning' @trafficMeasureConcept 'startDate')
            as |error warning|
          }}
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
                @value={{@trafficMeasureConcept.startDate}}
                @onChange={{fn this.setTrafficMeasureDate 'startDate'}}
              />
              <ErrorMessage @error={{error}} @warning={{warning}} />
            </AuFormRow>
          {{/let}}
          {{#let
            (this.getError 'error' @trafficMeasureConcept 'endDate')
            (this.getError 'warning' @trafficMeasureConcept 'endDate')
            as |error warning|
          }}
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
                @min={{@trafficMeasureConcept.startDate}}
                @value={{@trafficMeasureConcept.endDate}}
                @onChange={{fn this.setTrafficMeasureDate 'endDate'}}
              />
              <ErrorMessage @error={{error}} @warning={{warning}} />
            </AuFormRow>
          {{/let}}
          <AuHeading
            @level='4'
            @skin='4'
            class='au-u-margin-bottom-small au-u-margin-top-small'
          >
            {{t 'traffic-measure-concept.attr.traffic-sign'}}
          </AuHeading>
          <div class='au-o-grid au-o-grid--tiny'>
            <div class='au-o-grid__item au-u-1-4@medium'>
              <TrafficMeasureSelectType
                @selectedType={{this.selectedType}}
                @updateTypeFilter={{this.updateTypeFilter}}
              />
            </div>
            <div class='au-o-grid__item au-u-1-4@medium'>
              {{! @glint-expect-error need to move to PS 8 }}
              <PowerSelect
                {{! @glint-expect-error need to move to PS 8 }}
                @allowClear={{true}}
                @options={{this.validationStatusOptions}}
                @selected={{this.selectedValidationStatus}}
                @placeholder={{t
                  'traffic-measure-concept.crud.validation-filter-placeholder'
                }}
                @onChange={{this.updateValidationFilter}}
                as |validationType|
              >
                {{validationType.label}}
              </PowerSelect>
            </div>
            <div class='au-o-grid__item au-u-2-4@medium'>
              <TrafficMeasureAddSign
                @selectedType={{this.selectedType}}
                @selectedValidation={{this.signValidation}}
                @addSign={{this.addSign}}
                @disabled={{this.isSelectedTypeEmpty}}
                @signs={{this.signs}}
              />
            </div>
            <div class='au-o-grid__item'>
              <TrafficMeasureSignList
                @removeSign={{this.removeSign}}
                @signs={{this.signs}}
                @onSort={{this.sortSigns}}
              />
            </div>
          </div>
          {{#let (this.getError 'error' this.template 'value') as |error|}}
            <div class='au-u-margin-bottom-small'>
              <AuHeading @level='4' @skin='4'>
                {{t 'traffic-measure-concept.attr.template'}}
              </AuHeading>
              <AuHelpText
                @skin='secondary'
                class='au-u-margin-bottom-small au-u-flex-center'
              >
                <AuBadge
                  @icon='info-circle'
                  @size='small'
                  class='au-u-margin-right-tiny'
                />
                {{t 'traffic-measure-concept.help'}}
              </AuHelpText>
              {{! template-lint-disable no-inline-styles }}
              <AuTextarea
                id='textarea'
                @width='block'
                {{on 'input' this.updateTemplate}}
                {{on 'input' this.parseTemplate}}
                value={{this.template.value}}
                style='resize: none; height: 200px;'
                class='au-u-margin-bottom-small'
                @error={{isSome error}}
              />
              <ErrorMessage @error={{error}} />
            </div>
          {{/let}}
          {{#if this.variables.length}}
            <AuHeading @level='4' @skin='4' class='au-u-margin-bottom-small'>
              {{t 'traffic-measure-concept.attr.variables'}}
            </AuHeading>
            <div class='au-c-card'>
              <div class='au-data-table'>
                <div class='au-c-data-table__wrapper'>
                  <table
                    class='au-c-data-table__table au-c-data-table__table--small'
                  >
                    <thead class='au-c-data-table__header'>
                      <tr>
                        <th>{{t 'traffic-measure-concept.attr.variable'}}</th>
                        <th>{{t 'utility.required'}}</th>
                        <th>{{t 'traffic-measure-concept.attr.type'}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {{#each this.variables as |variable varIndex|}}
                        <tr>
                          <td>{{variable.label}}</td>
                          {{! template-lint-disable no-inline-styles }}
                          <td style='width: 33%;'>
                            <AuCheckbox
                              @checked={{variable.required}}
                              @onChange={{fn
                                this.updateVariableRequired
                                variable
                              }}
                            >
                              {{t 'utility.required'}}
                            </AuCheckbox>
                          </td>
                          <td style='width: 33%;'>
                            {{! @glint-expect-error need to move to PS 8 }}
                            <PowerSelect
                              {{! @glint-expect-error need to move to PS 8 }}
                              @allowClear={{false}}
                              @searchEnabled={{false}}
                              @options={{this.variableTypes}}
                              @selected={{variable.type}}
                              @onChange={{fn
                                this.updateVariableType
                                varIndex
                                variable
                              }}
                              as |type|
                            >
                              {{this.variablesService.labelForVariableType
                                type
                              }}
                            </PowerSelect>
                            {{#if (isCodelistVariable variable)}}
                              {{! @glint-expect-error need to move to PS 8 }}
                              <PowerSelect
                                {{! @glint-expect-error need to move to PS 8 }}
                                @triggerClass='au-u-margin-top-tiny'
                                @allowClear={{false}}
                                @searchEnabled={{false}}
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
                                {{! @glint-expect-error promises, promises, promises... }}
                                {{#each variable.codeList.concepts as |option|}}
                                  <li
                                    class='au-c-list-help__item'
                                  >{{option.label}}</li>
                                {{/each}}
                              </ul>
                              <ErrorMessage
                                @error={{get variable.error 'codeList'}}
                              />
                            {{/if}}
                            {{#if (isInstructionVariable variable)}}
                              {{! @glint-expect-error need to move to PS 8 }}
                              <PowerSelect
                                {{! @glint-expect-error need to move to PS 8 }}
                                @triggerClass='au-u-margin-top-tiny'
                                @allowClear={{false}}
                                @searchEnabled={{false}}
                                @options={{this.instructions}}
                                @selected={{variable.template}}
                                @onChange={{fn this.updateInstruction variable}}
                                as |instruction|
                              >
                                <div class='au-c-thumbnail-holder'>
                                  <img
                                    class='au-c-thumbnail au-c-thumbnail--small au-u-margin-right-tiny'
                                    src={{instruction.parentConcept.image.file.downloadLink}}
                                    alt=''
                                  />
                                  <span title={{instruction.value}}>{{truncate
                                      instruction.value
                                    }}</span>
                                </div>
                              </PowerSelect>
                            {{/if}}
                          </td>
                        </tr>
                      {{/each}}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {{/if}}
        </div>
      </div>

      <div
        class='au-o-grid__item au-u-1-2@medium u-border-solid u-border-l u-border-divider'
      >
        <div class='au-o-box au-c-body-container au-c-body-container--scroll'>
          <TrafficMeasurePreview @signs={{this.signs}}>
            <:template>
              {{this.previewHtml}}
            </:template>
          </TrafficMeasurePreview>
        </div>
      </div>
    </div>
  </template>
}
