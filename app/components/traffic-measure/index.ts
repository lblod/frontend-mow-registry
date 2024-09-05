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
import TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';
import TemplateModel from 'mow-registry/models/template';
import { unwrap } from 'mow-registry/utils/option';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import CodeListModel from 'mow-registry/models/code-list';
import ArrayProxy from '@ember/array/proxy';
import ApplicationInstance from '@ember/application/instance';
import { SignType } from 'mow-registry/components/traffic-measure/select-type';
import TrafficSignConceptModel from 'mow-registry/models/traffic-sign-concept';
import VariableModel from 'mow-registry/models/variable';

export type InputType = {
  value: string;
  label: string;
};

type Args = {
  trafficMeasureConcept: TrafficMeasureConceptModel;
};

export default class TrafficMeasureIndexComponent extends Component<Args> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;

  @tracked codeLists?: ArrayProxy<CodeListModel>;
  @tracked declare trafficMeasureConcept: TrafficMeasureConceptModel;
  @tracked signs: TrafficSignConceptModel[] = [];
  @tracked variables: VariableModel[] = [];
  @tracked template?: TemplateModel;
  @tracked searchString?: string;
  @tracked preview?: string;
  @tracked selectedType?: SignType | null;
  @tracked instructions: TemplateModel[] = [];
  @tracked inputTypes: InputType[] = [];
  @tracked instructionType: InputType;

  variablesToBeDeleted: VariableModel[] = [];

  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    this.inputTypes = [
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
    this.instructionType = {
      value: 'instruction',
      label: this.intl.t('utility.template-variables.instruction'),
    };
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
      if (sign instanceof RoadSignConceptModel) {
        result = `${result}${sign.label ?? ''}-`;
      } else if (sign instanceof RoadMarkingConceptModel) {
        result = `${result}${sign.label ?? ''}-`;
      } else if (sign instanceof TrafficLightConceptModel) {
        result = `${result}${sign.label ?? ''}-`;
      }
    });

    //get rid of the last dash
    result = result.slice(0, -1);

    return `${result} Traffic Measure`;
  }

  get isSelectedTypeEmpty() {
    return !this.selectedType;
  }

  fetchData = task(async () => {
    // Wait for data loading
    const relatedTrafficSigns = await this.trafficMeasureConcept
      .relatedTrafficSignConcepts;

    this.codeLists = await this.codeListService.all.perform();

    // We assume that a measure has only one template
    this.template = await this.trafficMeasureConcept.template;
    this.variables = (await this.template.variables)
      .slice()
      .sort((a, b) => (a.id < b.id ? -1 : 1));
    // const relations = await this.trafficMeasureConcept.getOrderedRelations();

    this.signs = relatedTrafficSigns.toArray();

    await this.fetchInstructions.perform();

    await this.parseTemplate();
  });

  fetchInstructions = task(async () => {
    //refresh instruction list from available signs
    this.instructions = [];
    for (let i = 0; i < this.signs.length; i++) {
      const sign = this.signs[i];
      const instructions = await sign.hasInstructions;
      instructions.forEach((instr) => this.instructions.pushObject(instr));
    }

    //remove input type instruction if there are none available and reset variables with instructions
    if (this.instructions.length != 0) {
      if (this.inputTypes.indexOf(this.instructionType) == -1) {
        this.inputTypes.pushObject(this.instructionType);
      }
    } else if (this.instructions.length == 0) {
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
  async updateCodelist(variable: VariableModel, codeList: CodeListModel) {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.codeList = codeList;
    await this.generatePreview.perform();
  }

  @action
  async updateInstruction(variable: VariableModel, instruction: TemplateModel) {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.instruction = instruction;
    await this.generatePreview.perform();
  }

  @action
  async addSign(sign: TrafficSignConceptModel) {
    this.signs.pushObject(sign);
    await this.fetchInstructions.perform();
    this.selectedType = null;
  }

  @action
  async removeSign(sign: TrafficSignConceptModel) {
    this.signs.removeObject(sign);
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
  async addInstructionToTemplate(instruction: TemplateModel) {
    if (this.template) {
      this.template.value += `${instruction.value ?? ''} `;
      await this.parseTemplate();
    }
  }

  @action
  async updateVariableType(
    variable: VariableModel,
    selectedType: InputType | string,
  ) {
    variable.type =
      typeof selectedType === 'string' ? selectedType : selectedType.value;
    if (variable.type === 'codelist') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = this.codeLists?.firstObject;
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.instruction = null;
    } else if (variable.type === 'instruction') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.instruction = this.instructions[0];
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = null;
    } else {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.instruction = null;
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
          if (fReg[1] === variable.value) {
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
      if (!this.variables.find((variable) => variable.value === reg[1])) {
        this.variables.pushObject(
          this.store.createRecord('variable', {
            value: reg[1],
            type: 'text',
          }),
        );
      }
    });

    //remove duplicates in case something went wrong
    const filteredVariables: VariableModel[] = [];
    this.variables.forEach((variable) => {
      if (
        !filteredVariables.find(
          (fVariable) => fVariable.value === variable.value,
        )
      ) {
        filteredVariables.push(variable);
      } else {
        this.variablesToBeDeleted.push(variable);
      }
    });

    //sort variables in the same order as the regex result
    const sortedVariables: VariableModel[] = [];
    filteredRegexResult.forEach((reg) => {
      filteredVariables.forEach((variable) => {
        if (reg[1] == variable.value) {
          sortedVariables.push(variable);
        }
      });
    });

    //check existing default variables with deleted non-default variables and swap them
    sortedVariables.forEach((sVariable, sI) => {
      this.variablesToBeDeleted.forEach((dVariable, dI) => {
        if (sVariable.value === dVariable.value) {
          if (dVariable.type !== 'text' && sVariable.type === 'text') {
            sortedVariables.replace(sI, 1, [dVariable]);
            this.variablesToBeDeleted.replace(dI, 1, [sVariable]);
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
        const instruction = await variable.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction.value ?? '') +
          '</span>';
        this.preview = this.preview.replaceAll(
          '${' + (variable.value ?? '') + '}',
          replaceString,
        );
      }
    }
  });

  delete = task(async () => {
    const nodeShape = await this.store.query('node-shape', {
      'filter[targetHasConcept][id]': this.trafficMeasureConcept.id,
    });
    if (nodeShape.firstObject) {
      await nodeShape.firstObject?.destroyRecord();
    }
    // We assume a measure only has one template
    const template = await this.trafficMeasureConcept.template;
    if (template) {
      (await template.variables).forEach(
        (variable) => void variable.destroyRecord(),
      );
      await template.destroyRecord();
    }

    await this.trafficMeasureConcept.destroyRecord();
    await this.router.transitionTo('traffic-measure-concepts.index');
  });

  save = task(async () => {
    // We assume a measure only has one template
    const template = unwrap(await this.trafficMeasureConcept.template);

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

    await this.router.transitionTo('traffic-measure-concepts.index');
  });

  saveRoadsigns = task(
    async (trafficMeasureConcept: TrafficMeasureConceptModel) => {
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
        sign.hasTrafficMeasureConcepts.removeObject(trafficMeasureConcept);
        await sign.save();
      }

      for (const sign of addedSigns) {
        sign.hasTrafficMeasureConcepts.pushObject(trafficMeasureConcept);
        await sign.save();
      }
    },
  );

  saveVariables = task(async (template: TemplateModel) => {
    //destroy old ones
    await Promise.all(
      this.variablesToBeDeleted.map((variable) => variable.destroyRecord()),
    );

    //create new ones
    for (const variable of this.variables) {
      template.variables.pushObject(variable);
      await variable.save();
    }

    await template.save();
  });

  // annotateRdfa = task(async (template: TemplateModel) => {
  //   const contentWithVariables = await includeVariables(
  //     template.value ?? '',
  //     this.variables,
  //   );
  //   template.annotated = `
  //     <div property="dct:description">
  //       ${contentWithVariables}
  //     </div>
  //   `;
  //   await template.save();
  // });

  async willDestroy() {
    super.willDestroy();
    this.template?.rollbackAttributes();
    for (const variable of this.variables) {
      variable.rollbackAttributes();
    }
    this.trafficMeasureConcept.rollbackAttributes();
    await this.trafficMeasureConcept.belongsTo('zonality').reload();
  }
}
