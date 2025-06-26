import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import Store from '@ember-data/store';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';
import type TribontShape from 'mow-registry/models/tribont-shape';
import type Variable from 'mow-registry/models/variable';
import type Dimension from 'mow-registry/models/dimension';
import { tracked } from '@glimmer/tracking';
import { removeItem } from 'mow-registry/utils/array';

type Args = {
  roadMarkingConcept: RoadMarkingConcept;
};

export default class RoadMarkingFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  isArray = function isArray(maybeArray: unknown) {
    return Array.isArray(maybeArray);
  };

  @tracked shapesToRemove: TribontShape[] = [];
  @tracked variablesToRemove: Variable[] = [];
  dimensionsToRemove: Dimension[] = [];

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  async setRoadMarkingConceptValue(
    attributeName: ModifiableKeysOfType<RoadMarkingConcept, string>,
    event: InputEvent,
  ) {
    this.args.roadMarkingConcept[attributeName] = (
      event.target as HTMLInputElement
    ).value;
    await this.args.roadMarkingConcept.validateProperty(attributeName);
  }

  @action
  async setBooleanValue(
    attributeName: ModifiableKeysOfType<RoadMarkingConcept, boolean>,
    value: boolean,
  ) {
    this.args.roadMarkingConcept[attributeName] = value;
    await this.args.roadMarkingConcept.validateProperty(attributeName);
  }
  @action
  async setRoadMarkingDate(attribute: string, isoDate: string, date: Date) {
    if (date && attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    if (date) {
      this.args.roadMarkingConcept.set(attribute, date);
    } else {
      this.args.roadMarkingConcept.set(attribute, undefined);
    }
    await this.args.roadMarkingConcept.validateProperty('startDate', {
      warnings: true,
    });
    await this.args.roadMarkingConcept.validateProperty('endDate', {
      warnings: true,
    });
  }

  @action
  async addShape() {
    const shape = this.store.createRecord<TribontShape>('tribont-shape', {});
    (await this.args.roadMarkingConcept.shapes).push(shape);
  }

  @action
  async removeShape(shape: TribontShape) {
    const shapes = await this.args.roadMarkingConcept.shapes;
    removeItem(shapes, shape);
    this.shapesToRemove.push(shape);
  }

  removeDimension = async (shape: TribontShape, dimension: Dimension) => {
    removeItem(await shape.dimensions, dimension);

    this.dimensionsToRemove.push(dimension);
  };

  editRoadMarkingConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    const isValid = await this.args.roadMarkingConcept.validate();

    // validate the shapes and dimensions
    const shapes = await this.args.roadMarkingConcept.shapes;
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

    if (isValid && areShapesValid) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadMarkingConcept.set('image', imageRecord);

      await Promise.all(
        (await this.args.roadMarkingConcept.shapes).map(async (shape) => {
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

      await this.args.roadMarkingConcept.save();

      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        this.args.roadMarkingConcept.id,
      );
    }
  });

  @action
  setImage(model: TrafficSignConcept, image: File) {
    super.setImage(model, image);
    void this.args.roadMarkingConcept.validateProperty('image');
  }

  willDestroy() {
    super.willDestroy();
    this.args.roadMarkingConcept.reset();
  }
}
