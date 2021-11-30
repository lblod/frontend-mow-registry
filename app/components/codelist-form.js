import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import CodelistValidations from 'mow-registry/validations/codelist';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class CodelistFormComponent extends Component {
  @service router;
  @service store;

  @tracked newValue = '';
  @tracked toDelete = A();

  CodelistValidations = CodelistValidations;

  constructor() {
    super(...arguments);
    this.options = this.args.codelistOptions ? this.args.codelistOptions : [];
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
      yield codelist.codeListOptions.save();
      this.router.transitionTo('codelists-management.codelist', codelist.id);
    }
  }

  @action
  cancelEditingTask() {
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

    if (this.args.codelist.isNew) {
      this.router.transitionTo('codelists-management');
    } else {
      this.router.transitionTo(
        'codelists-management.codelist',
        this.args.codelist.id
      );
    }
  }
}
