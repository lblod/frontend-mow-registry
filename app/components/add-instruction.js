import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import includeMappings from '../utils/include-mappings';

export default class AddInstructionComponent extends Component {
  @service store;
  @service router;
  @service('codelists') codeListService;

  @tracked template;
  @tracked concept;

  @tracked mappings;
  @tracked codeLists;

  @tracked new;
  @tracked inputTypes = ['text', 'number', 'date', 'location', 'codelist'];

  mappingsToBeDeleted = [];

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
      this.mappings = await this.template.mappings;
      this.mappings = this.mappings
        .slice()
        .sort((a, b) => (a.id < b.id ? -1 : 1));
    } else {
      this.new = true;
      this.template = this.store.createRecord('template');
      this.template.value = '';
      this.concept.templates.pushObject(this.template);
      this.mappings = this.template.mappings;
    }
    this.parseTemplate();
  });

  @action
  async updateMappingType(mapping, type) {
    mapping.type = type;
    if (type === 'codelist' && !(await mapping.codeList)) {
      mapping.codeList = this.codeLists[0];
    } else {
      mapping.codeList = null;
    }
  }

  @action
  updateCodeList(mapping, codeList) {
    mapping.codeList = codeList;
  }

  @action
  updateTemplate(event) {
    this.template.value = event.target.value;
    this.parseTemplate();
  }

  //only resetting things we got from parent component
  @action
  reset() {
    if (this.template.hasDirtyAttributes || this.template.isNew) {
      this.template.rollbackAttributes();
    }
    if (this.concept.hasDirtyAttributes || this.concept.isNew) {
      this.concept.rollBackAttributes();
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
          }),
        );
      }
    });

    //remove duplicates in case something went wrong
    const filteredMappings = [];
    this.mappings.forEach((mapping) => {
      if (
        !filteredMappings.find(
          (fMapping) => fMapping.variable === mapping.variable,
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
  }

  save = task(async () => {
    await this.template.save();
    this.concept.templates.pushObject(this.template);
    await this.concept.save();

    for (let i = 0; i < this.mappings.length; i++) {
      const mapping = this.mappings[i];
      this.template.mappings.pushObject(mapping);
      await mapping.save();
    }

    this.template.annotated = await includeMappings(
      this.template.value,
      this.mappings,
    );

    await this.template.save();
    await Promise.all(
      this.mappingsToBeDeleted.map((mapping) => mapping.destroyRecord()),
    );

    this.reset();
  });
}
