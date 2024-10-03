import type RouterService from '@ember/routing/router-service';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type Dimension from 'mow-registry/models/dimension';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import TribontShape from 'mow-registry/models/tribont-shape';
import { tracked } from '@glimmer/tracking';
import { removeItem } from 'mow-registry/utils/array';
import type Store from 'ember-data/store';

type Args = {
  roadSignConcept: RoadSignConcept;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  isArray = function isArray(maybeArray: unknown) {
    return Array.isArray(maybeArray);
  };

  @tracked shapesToRemove: TribontShape[] = [];
  dimensionsToRemove: Dimension[] = [];

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  async setRoadSignConceptValue(attributeName: string, event: InputEvent) {
    this.args.roadSignConcept.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.roadSignConcept.validateProperty(attributeName);
  }

  @action
  async setRoadSignConceptClassification(selection: RoadSignCategory[]) {
    this.args.roadSignConcept.set('classifications', selection);
    await this.args.roadSignConcept.validateProperty('classifications');
  }

  @action
  async addShape() {
    const shape = this.store.createRecord<TribontShape>('tribont-shape', {});
    (await this.args.roadSignConcept.shapes).push(shape);
  }

  @action
  async removeShape(shape: TribontShape) {
    const shapes = await this.args.roadSignConcept.shapes;
    removeItem(shapes, shape);
    this.shapesToRemove.push(shape);
  }

  removeDimension = async (shape: TribontShape, dimension: Dimension) => {
    removeItem(await shape.dimensions, dimension);

    this.dimensionsToRemove.push(dimension);
  };

  @action
  async setImage(model: RoadSignConcept, image: File) {
    super.setImage(model, image);
    await this.args.roadSignConcept.validateProperty('image');
  }

  editRoadSignConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    const isValid = await this.args.roadSignConcept.validate();

    // validate the shapes and dimensions
    const shapes = await this.args.roadSignConcept.shapes;
    const areShapesValid = !(
      await Promise.all(
        shapes.map(async (shape) => {
          const isShapeValid = await shape.validate();

          const dimensions = await shape.dimensions;
          const areDimensionsValid = !(
            await Promise.all(
              dimensions.map((dimension) => {
                return dimension.validate();
              }),
            )
          ).includes(false);

          return isShapeValid && areDimensionsValid;
        }),
      )
    ).includes(false);

    // validate variables
    const variables = await this.args.roadSignConcept.variables;
    const areVariablesValid = !(
      await Promise.all(
        variables.map(async (variable) => {
          return await variable.validate();
        }),
      )
    ).includes(false);

    if (isValid && areShapesValid && areVariablesValid) {
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
      await Promise.all(
        this.dimensionsToRemove.map((dimension) => dimension.destroyRecord()),
      );

      await Promise.all(
        (await this.args.roadSignConcept.variables).map(async (variable) => {
          await variable.save();
        }),
      );

      await this.args.roadSignConcept.save();
      void this.router.transitionTo(
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
