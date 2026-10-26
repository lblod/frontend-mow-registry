import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Store from 'mow-registry/services/store';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import perform from 'ember-concurrency/helpers/perform';
import { or } from 'ember-truth-helpers';
import t from 'ember-intl/helpers/t';
import { TrackedArray } from 'tracked-built-ins';
import type IntlService from 'ember-intl/services/intl';
import PowerSelect from 'ember-power-select/components/power-select';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import CodelistsService from 'mow-registry/services/codelists';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import Template from 'mow-registry/models/template';
import { isSome, type Option, unwrap } from 'mow-registry/utils/option';
import CodeList from 'mow-registry/models/code-list';
import type { SignalType } from 'mow-registry/components/traffic-measure/select-type';
import Variable, {
  allVariableTypes,
  signVariableTypes,
  type VariableType,
} from 'mow-registry/models/variable';
import { removeItem } from 'mow-registry/utils/array';
import validateTrafficMeasureDates from 'mow-registry/utils/validate-traffic-measure-dates';
import type SkosConcept from 'mow-registry/models/skos-concept';
import CodelistVariable, {
  isCodelistVariable,
} from 'mow-registry/models/codelist-variable';
import ValidationStatus from 'mow-registry/components/validation-status';
import ErrorMessage from 'mow-registry/components/error-message';
import ContentCheck from 'mow-registry/components/content-check';
import ZonalitySelector from 'mow-registry/components/zonality-selector';
import VariableSignageSelector from 'mow-registry/components/variable-signage-selector';
import TrafficMeasureSelectType, {
  trafficSignalType,
} from 'mow-registry/components/traffic-measure/select-type';
import TrafficMeasureAddSign from 'mow-registry/components/traffic-measure/add-sign';
import TrafficMeasureSignList from 'mow-registry/components/traffic-measure/sign-list';
import TrafficMeasurePreview from 'mow-registry/components/traffic-measure/preview';
import type VariablesService from 'mow-registry/services/variables-service';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import InstructionVariable, {
  isInstructionVariable,
} from 'mow-registry/models/instruction-variable';
import type TextVariable from 'mow-registry/models/text-variable';
import { validateVariables } from 'mow-registry/utils/validate-relations';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

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
  @tracked selectedType: SignalType = trafficSignalType;
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
    console.log(relatedTrafficSignals);

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
          await this.updateVariableType(variable, 'text');
        }
      }
    }
  });

  @action
  async updateCodelist(variable: Variable, codeList: CodeList) {
    if (isCodelistVariable(variable)) {
      (variable as CodelistVariable).set('codeList', codeList);
      await this.generatePreview.perform();
    }
  }

  @action
  async updateInstruction(variable: Variable, template: Template) {
    if (isInstructionVariable(variable)) {
      (variable as InstructionVariable).set('template', template);
      await this.generatePreview.perform();
    }
  }

  @action
  async addSign(sign: TrafficSignalListItem) {
    this.signs.push(sign);
    await this.fetchInstructions.perform();
    this.selectedType = trafficSignalType;
  }

  @action
  async removeSign(sign: TrafficSignalListItem) {
    removeItem(this.signs, sign);
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
  updateTypeFilter(selectedType: SignalType) {
    if (selectedType) {
      this.selectedType = selectedType;
    } else {
      this.selectedType = trafficSignalType;
    }
  }

  @action
  updateVariableRequired(variable: Variable) {
    variable.set('required', !variable.required);
  }

  @action
  async updateVariableType(variable: Variable, selectedType: VariableType) {
    const varIndex = this.variables.indexOf(variable);
    if (varIndex === -1) {
      return;
    }
    const newVar = (await this.variablesService.convertVariableType(
      variable,
      selectedType,
    )) as Variable;
    const newVars = [...this.variables];
    newVars[varIndex] = newVar;
    this.variables = newVars;
    this.variablesToBeDeleted.push(variable);
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

    //add new variables
    filteredRegexResult.forEach((reg) => {
      if (!this.variables?.find((variable) => variable.label === reg[1])) {
        let variableToAdd: Variable;

        // Check if there is a variable to restore (copy-pasting/moving around)
        // We search from end to start, as this array may contain multiple variables with the same label.
        // We want to select the one who has been last removed.
        const variableToRestoreIndex = this.variablesToBeDeleted.findLastIndex(
          (variable) => variable.label === reg[1],
        );

        if (variableToRestoreIndex > -1) {
          // In case a variable is copy-pasted/moved around:
          // Remove variable from `variablesToBeDeleted`, and add it to the `variables` array
          variableToAdd = unwrap(
            this.variablesToBeDeleted[variableToRestoreIndex],
          );
          this.variablesToBeDeleted.splice(variableToRestoreIndex, 1);
        } else {
          // Variable did not exist before, just create a new one
          variableToAdd = this.store.createRecord<TextVariable>(
            'text-variable',
            {
              label: reg[1],
            },
          ) as unknown as Variable;
        }
        this.variables?.push(variableToAdd);
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
        const instruction = await (variable as InstructionVariable).template;
        const label = (variable as InstructionVariable).label;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction?.value ?? '') +
          '</span>';
        this.preview = this.preview.replaceAll(
          '${' + (label ?? '') + '}',
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
      await this.store.request(saveRecord(this.args.trafficMeasureConcept));
      await this.store.request(saveRecord(template));
      await this.store.request(saveRecord(this.args.trafficMeasureConcept));
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
    await this.store.request(saveRecord(this.args.trafficMeasureConcept));

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

    for (const sign of deletedSigns) {
      sign.deleteRecord();
      await this.store.request(saveRecord(sign));
    }

    for (const sign of this.signs) {
      await this.store.request(saveRecord(sign));
    }
    trafficMeasureConcept.set(
      'relatedTrafficSignalConceptsOrdered',
      this.signs,
    );
    await this.store.request(saveRecord(trafficMeasureConcept));
  });

  saveVariables = task(async (template: Template) => {
    //destroy old ones
    await Promise.all(
      this.variablesToBeDeleted.map((variable) => variable.destroyRecord()),
    );

    //create new ones
    await Promise.all(
      this.variables.map((variable) =>
        this.store.request(saveRecord(variable)),
      ),
    );
    template.set('variables', this.variables);
    await this.store.request(saveRecord(template));
  });

  willDestroy() {
    super.willDestroy();

    const wasNew = this.args.trafficMeasureConcept?.isNew;
    this.template?.rollbackAttributes();
    for (const variable of this.variables) {
      variable.rollbackAttributes();
    }
    this.args.trafficMeasureConcept?.rollbackAttributes();
    if (!wasNew) {
      void this.args.trafficMeasureConcept?.belongsTo('zonality').reload();
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
      <div class='au-o-grid__item au-u-2-3@medium'>
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
          <div
            class='traffic-measure--properties-box au-u-padding au-u-margin-bottom'
          >
            <div class='au-o-grid'>
              <div class='au-o-grid__item au-u-1-2'>
                <AuHeading
                  @level='6'
                  @skin='6'
                  class='au-u-margin-bottom-small'
                >
                  {{t 'utility.zonality'}}
                  <AuPill> {{t 'utility.required'}}</AuPill>
                </AuHeading>
                <ZonalitySelector
                  @zonality={{@trafficMeasureConcept.zonality}}
                  @onChange={{this.updateZonality}}
                  @model={{@trafficMeasureConcept}}
                />
              </div>
              <div class='au-o-grid__item au-u-1-2'>
                <AuHeading
                  @level='6'
                  @skin='6'
                  class='au-u-margin-bottom-small'
                >
                  {{t 'traffic-measure-concept.attr.variable-signage'}}
                </AuHeading>
                <VariableSignageSelector @concept={{@trafficMeasureConcept}} />
              </div>
            </div>
            <div class='au-u-flex au-u-flex--between'>
              {{#let
                (this.getError 'error' @trafficMeasureConcept 'startDate')
                (this.getError 'warning' @trafficMeasureConcept 'startDate')
                as |error warning|
              }}
                <AuFormRow class='au-u-1-2 au-u-padding-right-huge'>
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
                    class='appuniversum-datepicker-full-width'
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
                <AuFormRow
                  class='au-u-1-2 au-u-padding-left au-u-padding-right'
                >
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
                    class='appuniversum-datepicker-full-width'
                    id='endDate'
                    @min={{@trafficMeasureConcept.startDate}}
                    @value={{@trafficMeasureConcept.endDate}}
                    @onChange={{fn this.setTrafficMeasureDate 'endDate'}}
                  />
                  <ErrorMessage @error={{error}} @warning={{warning}} />
                </AuFormRow>
              {{/let}}
            </div>
          </div>
          <AuHeading
            @level='4'
            @skin='4'
            class='au-u-margin-bottom-small au-u-margin-top-small'
          >
            {{t 'traffic-measure-concept.attr.traffic-sign'}}
          </AuHeading>
          <div class='au-o-grid au-o-grid--tiny'>
            <div class='au-o-grid__item au-u-1-4@medium'>
              <AuLabel>
                {{t 'traffic-measure-concept.attr.select-type'}}
              </AuLabel>
              <TrafficMeasureSelectType
                @selectedType={{this.selectedType}}
                @updateTypeFilter={{this.updateTypeFilter}}
              />
            </div>
            <div class='au-o-grid__item au-u-1-4@medium'>
              <AuLabel>
                {{t 'traffic-measure-concept.attr.select-validation-status'}}
              </AuLabel>
              <PowerSelect
                @allowClear={{true}}
                @options={{this.validationStatusOptions}}
                @selected={{this.selectedValidationStatus}}
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
        </div>
      </div>

      <div
        class='au-o-grid__item au-u-1-3@medium u-border-solid u-border-l u-border-divider'
      >
        <div class='au-o-box au-c-body-container au-c-body-container--scroll'>
          <TrafficMeasurePreview @signs={{this.signs}} />
        </div>
      </div>
    </div>
  </template>
}
