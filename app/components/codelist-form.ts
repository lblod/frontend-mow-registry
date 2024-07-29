import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask, task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import {
  COD_SINGLE_SELECT_ID,
  COD_CONCEPT_SCHEME_ID,
} from '../utils/constants';
import CodeListModel from 'mow-registry/models/code-list';
import SkosConcept from 'mow-registry/models/skos-concept';
import ArrayProxy from '@ember/array/proxy';
import Store from '@ember-data/store';
import Router from '@ember/routing/router';
import IconModel from 'mow-registry/models/icon';

type Args = {
  codelist: CodeListModel;
};

export default class CodelistFormComponent extends Component<Args> {
  @service declare router: Router;
  @service declare store: Store;

  @tracked newValue = '';
  @tracked toDelete: SkosConcept[] = [];
  @tracked declare options: ArrayProxy<SkosConcept>;

  @tracked codelistTypes?: ArrayProxy<SkosConcept>;
  @tracked selectedType?: SkosConcept;

  @tracked selectedIcon: IconModel | null = null;

  get valueOptions() {
    return this.options?.filter((model) => !(model instanceof IconModel));
  }

  get iconOptions() {
    return this.options?.filter((model) => model instanceof IconModel);
  }

  @action
  async didInsert() {
    this.options = await this.args.codelist.concepts;
    await this.fetchCodelistTypes.perform();
  }

  get isSaving() {
    return this.editCodelistTask.isRunning;
  }

  fetchCodelistTypes = task(async () => {
    const typesScheme = await this.store.findRecord(
      'concept-scheme',
      COD_CONCEPT_SCHEME_ID,
    );
    const types = await typesScheme.concepts;
    this.codelistTypes = types;
    if (await this.args.codelist.type) {
      this.selectedType = await this.args.codelist.type;
    } else {
      this.selectedType = this.codelistTypes.find(
        (type) => type.id === COD_SINGLE_SELECT_ID,
      );
    }
  });

  @action
  async setCodelistValue(
    attributeName: keyof CodeListModel,
    event: InputEvent,
  ) {
    await this.args.codelist.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.codelist.validateProperty(attributeName);
  }

  @action
  updateCodelistType(type: SkosConcept) {
    this.selectedType = type;
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    this.args.codelist.type = type;
  }

  @action
  updateNewValue(event: InputEvent) {
    this.newValue = (event.target as HTMLInputElement).value;
  }

  @action
  addNewValue(event: InputEvent) {
    event.preventDefault();
    if (this.newValue) {
      const codeListOption = this.store.createRecord('skos-concept');
      codeListOption.label = this.newValue;
      this.options.pushObject(codeListOption);
      this.newValue = '';
    }
  }

  @action
  removeOption(option: SkosConcept) {
    this.options.removeObject(option);
    this.toDelete.pushObject(option);
  }

  @action
  updateIconSelector(icon: IconModel) {
    this.selectedIcon = icon;
  }

  @action
  addNewIcon(event: InputEvent) {
    event.preventDefault();
    if (this.selectedIcon) {
      this.options.pushObject(this.selectedIcon);
      this.selectedIcon = null;
    }
  }

  @action
  removeIcon(icon: IconModel) {
    this.options.removeObject(icon);
  }

  editCodelistTask = dropTask(
    async (codelist: CodeListModel, event: InputEvent) => {
      event.preventDefault();

      await codelist.validate();

      if (!codelist.error) {
        await Promise.all(
          this.toDelete.map((option) => option.destroyRecord()),
        );
        await codelist.save();
        await Promise.all(this.options.map((option) => option.save()));
        await this.router.transitionTo(
          'codelists-management.codelist',
          codelist.id,
        );
      }
    },
  );

  @action
  async cancelEditingTask() {
    //@ts-expect-error for some reason the type of isNew is not Boolean
    if (this.args.codelist.isNew) {
      await this.router.transitionTo('codelists-management');
    } else {
      //@ts-expect-error for some reason, the type of .length is not number
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options.objectAt(i);
        //@ts-expect-error for some reason the type of isNew is not Boolean
        if (option && option.isNew) {
          option.rollbackAttributes();
          i--;
        }
      }

      for (let i = 0; i < this.toDelete.length; i++) {
        const option = this.toDelete.objectAt(i);
        if (option && !option.isNew) {
          option.rollbackAttributes();
          this.options.pushObject(option);
        }
      }

      await this.router.transitionTo(
        'codelists-management.codelist',
        this.args.codelist.id,
      );
    }
  }

  willDestroy() {
    super.willDestroy();
    this.args.codelist.reset();
  }
}
