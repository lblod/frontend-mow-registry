import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddInstructionComponent extends Component {
  @service store;
  @service router;
  @service ('codelists') codeListService

  @tracked template;
  @tracked concept;

  @tracked mappings;
  @tracked codeLists;

  @tracked new;
  @tracked inputTypes = ['text', 'number', 'date', 'location', 'codelist'];

  constructor(...args) {
    super(...args);
    this.fetchData.perform();
  }

  @task
  *fetchData() {
    this.concept = yield this.args.concept;
    this.codeLists = yield this.codeListService.all.perform();

    if (this.args.editedTemplate) {
      this.new = false;
      this.template = yield this.args.editedTemplate;
      this.mappings = yield this.template.mappings;
    } else {
      this.new = true;
      this.template = this.store.createRecord('template');
      this.template.value = '';
      this.concept.templates.pushObject(this.template);
      this.mappings = this.template.mappings;
    }
    
    this.parseTemplate();
  }

  @action
  async updateMappingType(mapping, type) {
    mapping.type = type;
    if (type === 'codelist' && !(await mapping.codeList)) {
      mapping.codeList = this.codeLists.firstObject;
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
      return filteredRegexResult.find((fReg) => fReg[1] === mapping.variable);
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
      }
    });
    this.mappings = filteredMappings;
  }

  @task
  *save() {
    yield this.concept.save();

    yield this.template.save();

    for (let i = 0; i < this.mappings.length; i++) {
      const mapping = this.mappings[i];
      this.template.mappings.pushObject(mapping);
      yield mapping.save();
      yield this.template.save();
    }
    this.reset();
  }
}
