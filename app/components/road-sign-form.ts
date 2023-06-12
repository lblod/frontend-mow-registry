import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptValidations from 'mow-registry/validations/road-sign-concept';
import { BufferedChangeset } from 'ember-changeset/types';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  RoadSignConceptValidations = RoadSignConceptValidations;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  setRoadSignConceptCategory(
    changeset: BufferedChangeset,
    selection: RoadSignCategoryModel[]
  ) {
    changeset.categories = selection;
  }

  editRoadSignConceptTask = dropTask(
    async (changeset: BufferedChangeset, event: InputEvent) => {
      event.preventDefault();

      await changeset.validate();

      if (changeset.isValid) {
        await this.saveImage(changeset);
        await changeset.save();

        await this.router.transitionTo(
          'road-sign-concepts.road-sign-concept',
          changeset.id
        );
      }
    }
  );

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.rollbackAttributes();
  }
}
