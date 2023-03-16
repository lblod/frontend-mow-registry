import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import includeMappings from '../../utils/include-mappings';

const TRAFFIC_MEASURE_RESOURCE_UUID = 'f51431b5-87f4-4c15-bb23-2ebaa8d65446';

export default class TrafficMeasureIndexComponent extends Component {
  @service store;
  @service router;
  @service intl;
  @service('codelists') codeListService;

  @tracked codeLists;
  @tracked new;
  @tracked trafficMeasureConcept;
  @tracked signs = [];
  @tracked mappings = [];
  @tracked template;
  @tracked searchString;
  @tracked signError;
  @tracked preview;
  @tracked selectedType;
  @tracked instructions = [];
  @tracked inputTypes = [];

  mappingsToBeDeleted = [];

  constructor() {
    super(...arguments);
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
    this.new = this.args.new;
    this.fetchData.perform();
  }

  get previewHtml() {
    return htmlSafe(this.preview);
  }

  get label() {
    let result = '';

    this.signs.forEach((e) => {
      if (e.get('roadSignConceptCode'))
        result = `${result}${e.get('roadSignConceptCode')}-`;
      else if (e.get('roadMarkingConceptCode'))
        result = `${result}${e.get('roadMarkingConceptCode')}-`;
      else if (e.get('trafficLightConceptCode'))
        result = `${result}${e.get('trafficLightConceptCode')}-`;
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
    await this.trafficMeasureConcept.relations;

    this.codeLists = await this.codeListService.all.perform();

    // We assume that a measure has only one template
    const templates = await this.trafficMeasureConcept.templates;
    this.template = await templates.firstObject;
    this.mappings = await this.template.mappings;

    this.mappings.sortBy('id');

    const relations = await this.trafficMeasureConcept.orderedRelations;

    this.signs = await Promise.all(
      relations.map((relation) => relation.concept)
    );

    await this.fetchInstructions.perform();

    this.parseTemplate();
  });

  fetchInstructions = task(async () => {
    //refresh instruction list from available signs
    this.instructions = [];
    for (let i = 0; i < this.signs.length; i++) {
      const sign = this.signs[i];
      const instructions = await sign.templates;
      for (let j = 0; j < instructions.length; j++) {
        const instruction = instructions.objectAt(j);
        this.instructions.pushObject(instruction);
      }
    }

    //remove input type instruction if there are none available and reset mappings with instructions
    if (this.instructions.length != 0) {
      if (this.inputTypes.indexOf(this.instructionType) == -1) {
        this.inputTypes.pushObject(this.instructionType);
      }
    } else if (this.instructions.length == 0) {
      if (this.inputTypes.indexOf(this.instructionType) != -1) {
        console.log('FETCH DATA');
        this.inputTypes.splice(
          this.inputTypes.indexOf(this.instructionType),
          1
        );
      }
      this.mappings.forEach((e) => {
        if (e.type == this.instructionType.value) {
          this.updateMappingType(e, 'text');
        }
      });
    }
  });

  @action
  updateCodelist(mapping, codeList) {
    mapping.codeList = codeList;
    this.generatePreview.perform();
  }

  @action
  updateInstruction(mapping, instruction) {
    mapping.instruction = instruction;
    this.generatePreview.perform();
  }

  @action
  addSign(sign) {
    this.signs.pushObject(sign);
    this.fetchInstructions.perform();
    this.selectedType = null;
  }

  @action
  removeSign(sign) {
    this.signs.removeObject(sign);
    this.fetchInstructions.perform();
  }

  @action
  updateTemplate(event) {
    this.template.value = event.target.value;
  }

  @action
  updateTypeFilter(selectedType) {
    if (selectedType) {
      this.selectedType = selectedType;
    } else {
      this.selectedType = null;
    }
  }

  @action
  addInstructionToTemplate(instruction) {
    this.template.value += `${instruction.value} `;
    this.parseTemplate();
  }

  @action
  updateMappingType(mapping, selectedType) {
    mapping.type = selectedType.value;
    if (mapping.type === 'codelist') {
      mapping.codeList = this.codeLists.firstObject;
      mapping.instruction = null;
    } else if (mapping.type === 'instruction') {
      mapping.instruction = this.instructions.firstObject;
      mapping.codeList = null;
    } else {
      mapping.instruction = null;
      mapping.codeList = null;
    }
    this.generatePreview.perform();
  }

  //parsing algo that keeps ui changes in tact
  @action
  parseTemplate() {
    //match "a-z", "A-Z", "-", "_", "." and "any digit characters" between ${ and } lazily
    const regex = new RegExp(/\${([a-zA-Z\-_.\d]+?)}/g);
    const regexResult = [...this.template.value.matchAll(regex)];

    //remove duplicates from regex result
    const filteredRegexResult = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variable mappings from current array
    //turns mappings into a non ember data thing
    this.mappings = this.mappings.filter((mapping) => {
      //search regex results if they contain this mapping
      if (
        filteredRegexResult.find((fReg) => {
          if (fReg[1] === mapping.variable) {
            return true;
          }
        })
      ) {
        return true;
      } else {
        this.mappingsToBeDeleted.push(mapping);
      }
    });

    //add new variable mappings
    filteredRegexResult.forEach((reg) => {
      if (!this.mappings.find((mapping) => mapping.variable === reg[1])) {
        this.mappings.pushObject(
          this.store.createRecord('mapping', {
            variable: reg[1],
            type: 'text',
            expects: this.nodeShape,
          })
        );
      }
    });

    //remove duplicates in case something went wrong
    const filteredMappings = [];
    this.mappings.forEach((mapping) => {
      if (
        !filteredMappings.find(
          (fMapping) => fMapping.variable === mapping.variable
        )
      ) {
        filteredMappings.push(mapping);
      } else {
        this.mappingsToBeDeleted.push(mapping);
      }
    });

    //sort mappings in the same order as the regex result
    const sortedMappings = [];
    filteredRegexResult.forEach((reg) => {
      filteredMappings.forEach((mapping) => {
        if (reg[1] == mapping.variable) {
          sortedMappings.push(mapping);
        }
      });
    });

    //check existing default mappings with deleted non-default mappings and swap them
    sortedMappings.forEach((sMapping, sI) => {
      this.mappingsToBeDeleted.forEach((dMapping, dI) => {
        if (sMapping.variable === dMapping.variable) {
          if (dMapping.type !== 'text' && sMapping.type === 'text') {
            sortedMappings.replace(sI, 1, [dMapping]);
            this.mappingsToBeDeleted.replace(dI, 1, [sMapping]);
          }
        }
      });
    });

    this.mappings = sortedMappings;

    this.generatePreview.perform();
  }

  generatePreview = task(async () => {
    this.preview = this.template.value;

    for (const mapping of this.mappings) {
      let replaceString;
      if (mapping.type === 'instruction') {
        const instruction = await mapping.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          instruction.value +
          '</span>';
        this.preview = this.preview.replaceAll(
          '${' + mapping.variable + '}',
          replaceString
        );
      }
    }
  });

  delete = task(async () => {
    const nodeShape = await this.store.query('node-shape', {
      'filter[targetHasConcept][id]': this.trafficMeasureConcept.id,
    });
    if (await nodeShape.firstObject) {
      await ((await nodeShape.firstObject)).destroyRecord();
    }
    // We assume a measure only has one template
    await ((await ((await this.trafficMeasureConcept.get('templates')
      .firstObject)).get('mappings'))).forEach((mapping) =>
      mapping.destroyRecord()
    );
    await ((await this.trafficMeasureConcept.get('templates')
      .firstObject)).destroyRecord();
    await ((await this.trafficMeasureConcept.get('relations'))).forEach(
      (relation) => relation.destroyRecord()
    );

    await this.trafficMeasureConcept.destroyRecord();
    this.router.transitionTo('traffic-measure-concepts.index');
  });

  save = task(async () => {
    // We assume a measure only has one template
    const template = await this.trafficMeasureConcept.templates.firstObject;

    //if new save relationships
    if (this.new) {
      await this.trafficMeasureConcept.save();
      const trafficMeasureResource = await this.store.findRecord(
        'resource',
        TRAFFIC_MEASURE_RESOURCE_UUID
      );
      const nodeShape = this.store.createRecord('node-shape');
      nodeShape.targetClass = trafficMeasureResource;
      nodeShape.targetHasConcept = this.trafficMeasureConcept;
      await nodeShape.save();
      await template.save();
      await this.trafficMeasureConcept.save();
    }

    //1-parse everything again
    this.parseTemplate();

    //2-update node shape
    this.trafficMeasureConcept.label = this.label;
    await this.trafficMeasureConcept.save();

    //3-update roadsigns
    await this.saveRoadsigns.perform(this.trafficMeasureConcept);

    //4-handle variable mappings
    await this.saveMappings.perform(template);

    //5-annotate rdfa
    await this.annotateRdfa.perform(template);

    if (this.new) {
      this.router.transitionTo(
        'traffic-measure-concepts.edit',
        this.trafficMeasureConcept.id
      );
    }
  });

  saveRoadsigns = task(async trafficMeasureConcept => {
    // delete existing ones
    let length = trafficMeasureConcept.relations.length;
    for (let i = 0; i < length; i++) {
      const relation = trafficMeasureConcept.relations.objectAt(0);
      await relation.destroyRecord();
    }
    // creating signs
    trafficMeasureConcept.relations = [];
    for (let i = 0; i < this.signs.length; i++) {
      const mustUseRelation = this.store.createRecord('must-use-relation');
      mustUseRelation.concept = this.signs[i];
      mustUseRelation.order = i;
      trafficMeasureConcept.relations.pushObject(mustUseRelation);
      await mustUseRelation.save();
    }
    await trafficMeasureConcept.save();
  });

  saveMappings = task(async template => {
    //destroy old ones
    await Promise.all(
      this.mappingsToBeDeleted.map((mapping) => mapping.destroyRecord())
    );

    //create new ones
    for (const mapping of this.mappings) {
      template.mappings.pushObject(mapping);
      await mapping.save();
    }

    await template.save();
  });

  annotateRdfa = task(async template => {
    const contentWithMappings = await includeMappings(
      template.value,
      this.mappings
    );
    template.annotated = `
      <div property="dct:description">
        ${contentWithMappings}
      </div>
    `;
    await template.save();
  });
}
