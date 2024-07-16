import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import DimensionModel from 'mow-registry/models/dimension';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  async setRoadSignConceptValue(
    attributeName: keyof RoadSignConceptModel,
    event: InputEvent,
  ) {
    await this.args.roadSignConcept.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
  }

  @action
  async setRoadSignConceptClassification(selection: RoadSignCategoryModel[]) {
    this.args.roadSignConcept.set('classifications', selection);
  }

  @action
  async setRoadSignConceptShape(selection: RoadSignConceptModel) {
    this.args.roadSignConcept.set('shape', selection);
  }

  @action
  async setRoadSignConceptDimensions(selection: DimensionModel) {}

  @action
  async setImage(model: RoadSignConceptModel, image: File) {
    super.setImage(model, image);
  }

  editRoadSignConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadSignConcept.validate();

    if (!this.args.roadSignConcept.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadSignConcept.set('image', imageRecord);
      await this.args.roadSignConcept.save();

      await this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.args.roadSignConcept.id,
      );
    }
  });

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.reset();
  }
}
