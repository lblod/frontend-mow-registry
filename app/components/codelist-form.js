import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import CodelistValidations from 'mow-registry/validations/codelist';
import { tracked } from '@glimmer/tracking';

export default class CodelistFormComponent extends Component {
  @service router;
  @service store;

  @tracked newValue = '';
  @tracked options = [];

  CodelistValidations = CodelistValidations;

  constructor() {
    super(...arguments);

    this.options = this.args.codelistOptions
      ? this.args.codelistOptions.map((option) => option.label)
      : [];
  }

  get isSaving() {
    return this.editCodelistTask.isRunning;
  }

  @action
  setCodelistValue(codelist, attributeName, event) {
    codelist[attributeName] = event.target.value;
  }

  @action
  updateNewValue(event) {
    this.newValue = event.target.value;
  }

  @action
  addNewValue() {
    this.options.pushObject(this.newValue);
    this.newValue = '';
  }

  @action
  removeValue(value) {
    this.options.removeObject(value);
  }

  @dropTask
  *editCodelistTask(codelist, event) {
    event.preventDefault();

    yield codelist.validate();

    if (codelist.isValid) {
      const length = codelist.codeListOptions.length;
      for (let i = 0; i < length; i++) {
        const option = codelist.codeListOptions.objectAt(0);
        yield option.destroyRecord();
      }
      codelist.codeListOptions = [];
      yield this.options.forEach((option) => {
        const codeListOption = this.store.createRecord('code-list-option');
        codeListOption.label = option;
        codelist.codeListOptions.pushObject(codeListOption);
      });

      yield codelist.save();
      yield codelist.codeListOptions.save();
      this.router.transitionTo('codelists-management.codelist', codelist.id);
    }
  }
}
