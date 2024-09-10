import type RouterService from '@ember/routing/router-service';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import TribontShapeModel from 'mow-registry/models/tribont-shape';
import { tracked } from '@glimmer/tracking';
import { removeItem } from 'mow-registry/utils/array';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;

  @tracked shapesToRemove: TribontShapeModel[] = [];
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
    // @ts-expect-error .push isn't part of the @types/ember_data packages. Remove this once we switch to the official types.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (await this.args.roadSignConcept.shapes).push(shape);
  }
  @action
  async removeShape(shape: TribontShapeModel) {
    const shapes = await this.args.roadSignConcept.shapes;
    // @ts-expect-error ArrayProxy doesn't match the array type yet. This can probably be removed when we switch to the official types.
    removeItem(shapes, shape);
    this.shapesToRemove.push(shape);
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
        (await this.args.roadSignConcept.shapes).map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.save();
            }),
          );
          await shape.save();
        }),
      );

      await Promise.all(
        this.shapesToRemove.map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.destroyRecord();
            }),
          );
          await shape.destroyRecord();
        }),
      );

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
