import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import IntlService from 'ember-intl/services/intl';
import CodelistsService from 'mow-registry/services/codelists';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import Template from 'mow-registry/models/template';
import { unwrap } from 'mow-registry/utils/option';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import CodeList from 'mow-registry/models/code-list';
import ApplicationInstance from '@ember/application/instance';
import type { SignType } from 'mow-registry/components/traffic-measure/select-type';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
import Variable from 'mow-registry/models/variable';
import { removeItem } from 'mow-registry/utils/array';
import { TrackedArray } from 'tracked-built-ins';
import validateTrafficMeasureDates from 'mow-registry/utils/validate-traffic-measure-dates';

export type InputType = {
  value: string;
  label: string;
};
type Args = {
  trafficMeasureConcept: TrafficMeasureConcept;
};

export default class TrafficMeasureIndexComponent extends Component<Args> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;

  @tracked codeLists?: CodeList[];
  @tracked declare trafficMeasureConcept: TrafficMeasureConcept;
  @tracked signs: TrafficSignConcept[] = [];
  @tracked variables: Variable[] = [];
  @tracked template?: Template | null;
  @tracked searchString?: string;
  @tracked preview?: string;
  @tracked selectedType?: SignType | null;
  @tracked instructions: Template[] = [];
  @tracked inputTypes: InputType[];
  @tracked instructionType: InputType;
  @tracked signsError = false;
  @tracked signValidation?: string | null;

  variablesToBeDeleted: Variable[] = [];

  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    this.inputTypes = new TrackedArray([
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
    ]);

    this.instructionType = {
      value: 'instruction',
      label: this.intl.t('utility.template-variables.instruction'),
    };
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
    this.trafficMeasureConcept = this.args.trafficMeasureConcept;
    await this.fetchData.perform();
  }

  get new() {
    return this.trafficMeasureConcept?.isNew as unknown as boolean;
  }

  get previewHtml() {
    return this.preview ? htmlSafe(this.preview) : null;
  }

  get label() {
    let result = '';

    this.signs.forEach((sign) => {
      if (sign instanceof RoadSignConcept) {
        result = `${result}${sign.label ?? ''}-`;
      } else if (sign instanceof RoadMarkingConcept) {
        result = `${result}${sign.label ?? ''}-`;
      } else if (sign instanceof TrafficLightConcept) {
        result = `${result}${sign.label ?? ''}-`;
      }
    });

    //get rid of the last dash
    result = result.slice(0, -1);

    return result;
  }

  get isSelectedTypeEmpty() {
    return !this.selectedType;
  }

  fetchData = task(async () => {
    // Wait for data loading
    const relatedTrafficSigns =
      await this.trafficMeasureConcept.relatedTrafficSignConcepts;

    this.codeLists = await this.codeListService.all.perform();

    // We assume that a measure has only one template
    this.template = await this.trafficMeasureConcept.template;
    if (this.template) {
      this.variables = (await this.template.variables).slice().sort((a, b) => {
        if (a.id && b.id) {
          return a.id < b.id ? -1 : 1;
        } else {
          return 0;
        }
      });
      // const relations = await this.trafficMeasureConcept.getOrderedRelations();
    }

    this.signs = new TrackedArray(relatedTrafficSigns);

    await this.fetchInstructions.perform();

    await this.parseTemplate();
  });

  fetchInstructions = task(async () => {
    //refresh instruction list from available signs
    const instructions: Template[] = [];
    for (let i = 0; i < this.signs.length; i++) {
      const sign = this.signs[i];
      if (sign) {
        const signInstructions = await sign.hasInstructions;
        signInstructions.forEach((instr) => instructions.push(instr));
      }
    }

    this.instructions = instructions;

    //remove input type instruction if there are none available and reset variables with instructions
    if (instructions.length != 0) {
      if (this.inputTypes.indexOf(this.instructionType) == -1) {
        this.inputTypes.push(this.instructionType);
      }
    } else if (instructions.length == 0) {
      if (this.inputTypes.indexOf(this.instructionType) != -1) {
        this.inputTypes.splice(
          this.inputTypes.indexOf(this.instructionType),
          1,
        );
      }
      for (const variable of this.variables) {
        if (variable.type == this.instructionType.value) {
          await this.updateVariableType(variable, 'text');
        }
      }
    }
  });

  @action
  async updateCodelist(variable: Variable, codeList: CodeList) {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.codeList = codeList;
    await this.generatePreview.perform();
  }

  @action
  async updateInstruction(variable: Variable, template: Template) {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.template = template;
    await this.generatePreview.perform();
  }

  @action
  async addSign(sign: TrafficSignConcept) {
    this.signs.push(sign);
    await this.fetchInstructions.perform();
    this.selectedType = null;
  }

  @action
  async removeSign(sign: TrafficSignConcept) {
    removeItem(this.signs, sign);
    await this.fetchInstructions.perform();
  }

  @action
  updateTemplate(event: InputEvent) {
    if (this.template) {
      this.template.value = (event.target as HTMLInputElement).value;
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
  async addInstructionToTemplate(instruction: Template) {
    if (this.template) {
      this.template.value += `${instruction.value ?? ''} `;
      await this.parseTemplate();
    }
  }

  @action
  updateVariableRequired(variable: Variable) {
    variable.set('required', !variable.required);
  }

  @action
  async updateVariableType(
    variable: Variable,
    selectedType: InputType | string,
  ) {
    variable.type =
      typeof selectedType === 'string' ? selectedType : selectedType.value;
    if (variable.type === 'codelist') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      variable.codeList = this.codeLists[0];
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.template = null;
    } else if (variable.type === 'instruction') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.template = this.instructions[0];
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = null;
    } else {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.template = null;
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = null;
    }
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
          this.store.createRecord<Variable>('variable', {
            label: reg[1],
            type: 'text',
          }),
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
      if (variable.type === 'instruction') {
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
    const template = unwrap(await this.trafficMeasureConcept.template);

    // Show custom error if no signs selected
    this.signsError = !this.signs.length;

    // Validate measure fields
    const isValid = await this.trafficMeasureConcept.validate();
    const isTemplateValid = await template.validate();
    if (!isValid || !isTemplateValid) {
      return;
    }

    // If there’s an error with the signs, return early to prevent the save from occurring
    if (this.signsError) return;

    //if new save relationships
    if (this.new) {
      await this.trafficMeasureConcept.save();
      await template.save();
      await this.trafficMeasureConcept.save();
    }

    //1-parse everything again
    await this.parseTemplate();

    //2-update node shape
    this.trafficMeasureConcept.label = this.label;
    await this.trafficMeasureConcept.save();

    //3-update roadsigns
    await this.saveRoadsigns.perform(this.trafficMeasureConcept);

    //4-handle variable variables
    await this.saveVariables.perform(template);

    // //5-annotate rdfa
    // await this.annotateRdfa.perform(template);

    this.router.transitionTo(
      'traffic-measure-concepts.details',
      this.trafficMeasureConcept.id,
    );
  });

  saveRoadsigns = task(async (trafficMeasureConcept: TrafficMeasureConcept) => {
    // delete existing ones
    const existingRelatedSigns = (
      await trafficMeasureConcept.relatedTrafficSignConcepts
    ).slice();

    const deletedSigns = existingRelatedSigns.filter(
      (sign) => !this.signs.includes(sign),
    );
    const addedSigns = this.signs.filter(
      (sign) => !existingRelatedSigns.includes(sign),
    );

    for (const sign of deletedSigns) {
      removeItem(await sign.hasTrafficMeasureConcepts, trafficMeasureConcept);
      await sign.save();
    }

    for (const sign of addedSigns) {
      (await sign.hasTrafficMeasureConcepts).push(trafficMeasureConcept);
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

    const wasNew = this.trafficMeasureConcept.isNew;
    this.template?.rollbackAttributes();
    for (const variable of this.variables) {
      variable.rollbackAttributes();
    }
    this.trafficMeasureConcept.rollbackAttributes();
    if (!wasNew) {
      void this.trafficMeasureConcept.belongsTo('zonality').reload();
    }
  }
  @action
  async setTrafficMeasureDate(attribute: string, isoDate: string, date: Date) {
    if (attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    this.trafficMeasureConcept.set(attribute, date);
    if (
      this.trafficMeasureConcept.startDate &&
      this.trafficMeasureConcept.endDate
    ) {
      await this.trafficMeasureConcept.validateProperty('startDate', {
        warnings: true,
      });
      await this.trafficMeasureConcept.validateProperty('endDate', {
        warnings: true,
      });
      void validateTrafficMeasureDates(this.trafficMeasureConcept);
    }
  }
}
