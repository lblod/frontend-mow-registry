import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptValidations from 'mow-registry/validations/road-sign-concept';
import { BufferedChangeset } from 'ember-changeset/types';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import TribontShapeModel from 'mow-registry/models/tribont-shape';
import Store from '@ember-data/store';
import DimensionModel from 'mow-registry/models/dimension';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;
  @service declare store: Store;

  RoadSignConceptValidations = RoadSignConceptValidations;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  setRoadSignConceptCategory(
    changeset: BufferedChangeset,
    selection: RoadSignCategoryModel[],
  ) {
    changeset.classifications = selection;
  }

  @action
  setRoadSignConceptShape(
    changeset: BufferedChangeset,
    selection: TribontShapeModel[],
  ) {
    changeset.shape = selection;
  }

  @action
  setRoadSignConceptDimensions(
    changeset: BufferedChangeset,
    selection: DimensionModel[],
  ) {
    changeset.dimensions = selection;
  }

  editRoadSignConceptTask = dropTask(
    async (changeset: BufferedChangeset, event: InputEvent) => {
      event.preventDefault();
      await changeset.validate();
      if (changeset.isValid) {
        const image = await this.saveImage(this.store);
        if (image !== null) {
          changeset.image = image;
          console.log('changeset.image', changeset.image);
        }
        try {
          await changeset.save();
          console.log('changeset saved');
        } catch (error) {
          console.error('Error saving changeset:', error);
        }
        await this.router.transitionTo(
          'road-sign-concepts.road-sign-concept',
          changeset.id,
        );
      }
    },
  );

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.rollbackAttributes();
  }
}
