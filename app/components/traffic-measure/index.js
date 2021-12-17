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
  constructor(...args) {
    super(...args);

    this.trafficMeasureConcept = this.args.trafficMeasureConcept;
    this.new = this.args.new;
    this.fetchData.perform();
    this.inputTypes = [
      {
        value: 'text',
        label: this.intl.t('utility.templateVariables.text'),
      },
      {
        value: 'number',
        label: this.intl.t('utility.templateVariables.number'),
      },
      {
        value: 'date',
        label: this.intl.t('utility.templateVariables.date'),
      },
      {
        value: 'location',
        label: this.intl.t('utility.templateVariables.location'),
      },
      {
        value: 'codelist',
        label: this.intl.t('utility.templateVariables.codelist'),
      },
    ];
    this.instructionType = {
      value: 'instruction',
      label: this.intl.t('utility.templateVariables.instruction'),
    };
  }

  mappingsToBeDeleted = [];

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

  @task
  *fetchData() {
    // Wait for data loading
    yield this.trafficMeasureConcept.relations;
    this.codeLists = yield this.codeListService.all.perform();

    // We assume that a measure has only one template
    const templates = yield this.trafficMeasureConcept.templates;
    this.template = yield templates.firstObject;
    this.mappings = yield this.template.mappings;
    this.mappings.sortBy('id');

    const relations = yield this.trafficMeasureConcept.orderedRelations;

    this.signs = yield Promise.all(
      relations.map((relation) => relation.concept)
    );

    yield this.fetchInstructions.perform();

    this.parseTemplate();
  }

  @task
  *fetchInstructions() {
    //refresh instruction list from available signs
    this.instructions = [];
    for (let i = 0; i < this.signs.length; i++) {
      const sign = this.signs[i];
      const instructions = yield sign.templates;
      for (let j = 0; j < instructions.length; j++) {
        const instruction = instructions.objectAt(j);
        this.instructions.pushObject(instruction);
      }
    }
    //remove input type instruction if there are none available and reset mappings with instructions
    if (this.instructions.length != 0) {
      this.inputTypes.pushObject(this.instructionType);
    } else if (this.instructions.length == 0) {
      if (this.inputTypes.indexOf(this.instructionType) != -1) {
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
  }

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
    //finds non-whitespase characters between ${ and }
    const regex = new RegExp(/\${(\S+?)}/g);
    const regexResult = [...this.template.value.matchAll(regex)];

    //remove duplicates from regex result
    const filteredRegexResult = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variable mappings from current array
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

    this.mappings = sortedMappings;

    this.generatePreview.perform();
  }

  @task
  *generatePreview() {
    this.preview = this.template.value;

    for (const mapping of this.mappings) {
      let replaceString;
      if (mapping.type === 'instruction') {
        const instruction = yield mapping.instruction;
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
  }

  @task
  *delete() {
    const nodeShape = yield this.store.query('node-shape', {
      'filter[targetHasConcept][id]': this.trafficMeasureConcept.id,
    });
    if (yield nodeShape.firstObject) {
      yield (yield nodeShape.firstObject).destroyRecord();
    }
    // We assume a measure only has one template
    yield (yield (yield this.trafficMeasureConcept.get('templates')
      .firstObject).get('mappings')).forEach((mapping) =>
      mapping.destroyRecord()
    );
    yield (yield this.trafficMeasureConcept.get('templates')
      .firstObject).destroyRecord();
    yield (yield this.trafficMeasureConcept.get(
      'relations'
    )).forEach((relation) => relation.destroyRecord());

    yield this.trafficMeasureConcept.destroyRecord();
    this.router.transitionTo('traffic-measure-concepts.index');
  }

  @task
  *save() {
    // We assume a measure only has one template
    const template = yield this.trafficMeasureConcept.templates.firstObject;

    //if new save relationships
    if (this.new) {
      yield this.trafficMeasureConcept.save();
      const trafficMeasureResource = yield this.store.findRecord(
        'resource',
        TRAFFIC_MEASURE_RESOURCE_UUID
      );
      const nodeShape = this.store.createRecord('node-shape');
      nodeShape.targetClass = trafficMeasureResource;
      nodeShape.targetHasConcept = this.trafficMeasureConcept;
      yield nodeShape.save();
      yield template.save();
      yield this.trafficMeasureConcept.save();
    }

    //1-parse everything again
    this.parseTemplate();

    //2-update node shape
    this.trafficMeasureConcept.label = this.label;
    yield this.trafficMeasureConcept.save();

    //3-update roadsigns
    yield this.saveRoadsigns.perform(this.trafficMeasureConcept);

    //4-handle variable mappings
    yield this.saveMappings.perform(template);

    //5-annotate rdfa
    yield this.annotateRdfa.perform(template);

    if (this.new) {
      this.router.transitionTo(
        'traffic-measure-concepts.edit',
        this.trafficMeasureConcept.id
      );
    }
  }

  @task
  *saveRoadsigns(trafficMeasureConcept) {
    // delete existing ones
    let length = trafficMeasureConcept.relations.length;
    for (let i = 0; i < length; i++) {
      const relation = trafficMeasureConcept.relations.objectAt(0);
      yield relation.destroyRecord();
    }
    // creating signs
    trafficMeasureConcept.relations = [];
    for (let i = 0; i < this.signs.length; i++) {
      const mustUseRelation = this.store.createRecord('must-use-relation');
      mustUseRelation.concept = this.signs[i];
      mustUseRelation.order = i;
      trafficMeasureConcept.relations.pushObject(mustUseRelation);
      yield mustUseRelation.save();
    }
    yield trafficMeasureConcept.save();
  }

  @task
  *saveMappings(template) {
    //destroy old ones
    yield Promise.all(
      this.mappingsToBeDeleted.map((mapping) => mapping.destroyRecord())
    );

    //create new ones
    for (const mapping of this.mappings) {
      template.mappings.pushObject(mapping);
      yield mapping.save();
    }

    yield template.save();
  }

  @task
  *annotateRdfa(template) {
    const contentWithMappings = yield includeMappings(
      template.value,
      this.mappings
    );
    template.annotated = `
      <div property="dct:description">
        ${contentWithMappings}
      </div>
    `;
    yield template.save();
  }
}
