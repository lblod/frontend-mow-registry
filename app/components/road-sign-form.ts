import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import TribontShapeModel from 'mow-registry/models/tribont-shape';

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
    await this.args.roadSignConcept.validateProperty(attributeName);
  }

  @action
  async setRoadSignConceptClassification(selection: RoadSignCategoryModel[]) {
    this.args.roadSignConcept.set('classifications', selection);
    await this.args.roadSignConcept.validateProperty('classifications');
  }

  @action
  async addShape(shape: TribontShapeModel) {
    const shapes = await this.args.roadSignConcept.shapes;
    shapes.pushObject(shape);
  }

  @action
  async setImage(model: RoadSignConceptModel, image: File) {
    super.setImage(model, image);
    await this.args.roadSignConcept.validateProperty('image');
  }

  editRoadSignConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadSignConcept.validate();

    if (!this.args.roadSignConcept.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadSignConcept.set('image', imageRecord); // image gets updated, but not overwritten

      await Promise.all(
        this.args.roadSignConcept.shapes.map(async (shape) => {
          await Promise.all(
            shape.dimensions.map(async (dimension) => {
              await dimension.save();
            }),
          );
          await shape.save();
        }),
      );

      await this.args.roadSignConcept.save();
      await this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.args.roadSignConcept.id,
      );
    } else {
      console.log(this.args.roadSignConcept.error);
    }
  });

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.reset();
  }
}
