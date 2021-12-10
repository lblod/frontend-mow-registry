import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask, task } from 'ember-concurrency';
import CodelistValidations from 'mow-registry/validations/codelist';
import { tracked } from '@glimmer/tracking';

const codelistTypesScheme = 'F452BCB4-4CE7-4318-8E00-5A96E7FED207';

export default class CodelistFormComponent extends Component {
  @service router;
  @service store;

  @tracked newValue = '';
  @tracked toDelete = [];
  @tracked selectedType;
  @tracked options;
  @tracked codelistTypes;

  CodelistValidations = CodelistValidations;

  constructor() {
    super(...arguments);
    this.options = this.args.codelist.codeListOptions;
    this.fetchCodelistTypes.perform();
  }

  get isSaving() {
    return this.editCodelistTask.isRunning;
  }

  @task
  *fetchCodelistTypes() {
    const typesScheme = yield this.store.findRecord(
      'concept-scheme',
      codelistTypesScheme,
      {
        include: 'concepts',
      }
    );
    const types = yield typesScheme.concepts;
    const codelistTypes = [];
    types.forEach((type) => {
      codelistTypes.push({
        value: type.id,
        label: type.label,
      });
    });
    console.log(this.args.codelist);
    const codelistType = yield this.args.codelist.get('type');
    this.codelistTypes = codelistTypes;
    this.selectedType = this.codelistTypes.find(
      (type) => type.value === codelistType.id
    );
  }

  @action
  setCodelistValue(codelist, attributeName, event) {
    codelist[attributeName] = event.target.value;
  }

  @task
  *updateCodelistType(type) {
    this.selectedType = type;
    const codelistType = yield this.store.findRecord(
      'skos-concept',
      type.value
    );
    this.args.codelist.type = codelistType;
  }

  @action
  updateNewValue(event) {
    this.newValue = event.target.value;
  }

  @action
  addNewValue(event) {
    event.preventDefault();
    const codeListOption = this.store.createRecord('code-list-option');
    codeListOption.label = this.newValue;
    this.options.pushObject(codeListOption);
    this.newValue = '';
  }

  @action
  removeOption(option) {
    this.options.removeObject(option);
    this.toDelete.pushObject(option);
  }

  @dropTask
  *editCodelistTask(codelist, event) {
    event.preventDefault();

    yield codelist.validate();

    if (codelist.isValid) {
      yield Promise.all(this.toDelete.map((option) => option.destroyRecord()));
      yield codelist.save();
      yield Promise.all(this.options.map((option) => option.save()));
      this.router.transitionTo('codelists-management.codelist', codelist.id);
    }
  }

  @action
  cancelEditingTask() {
    if (this.args.codelist.isNew) {
      this.router.transitionTo('codelists-management');
    } else {
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options.objectAt(i);
        if (option.isNew) {
          option.rollbackAttributes();
          i--;
        }
      }

      for (let i = 0; i < this.toDelete.length; i++) {
        const option = this.toDelete.objectAt(i);
        if (!option.isNew) {
          option.rollbackAttributes();
          this.options.pushObject(option);
        }
      }

      this.router.transitionTo(
        'codelists-management.codelist',
        this.args.codelist.id
      );
    }
  }
}
