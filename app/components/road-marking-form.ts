import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import Store from 'mow-registry/services/store';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';
import type TribontShape from 'mow-registry/models/tribont-shape';
import Variable from 'mow-registry/models/variable';
import type Dimension from 'mow-registry/models/dimension';
import { removeItem } from 'mow-registry/utils/array';
import {
  validateShapes,
  validateVariables,
} from 'mow-registry/utils/validate-relations';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

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
    return shape;
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
    const areShapesValid = await validateShapes(
      this.args.roadMarkingConcept.shapes,
    );
    const areVariablesValid = await validateVariables(
      this.args.roadMarkingConcept.variables,
    );
    if (isValid && areShapesValid && areVariablesValid) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadMarkingConcept.set('image', imageRecord);

      const savePromises: Promise<unknown>[] = [];
      savePromises.push(
        ...(await this.args.roadMarkingConcept.shapes).map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await this.store.request(saveRecord(dimension));
            }),
          );
          await this.store.request(saveRecord(shape));
        }),
      );

      savePromises.push(
        ...this.shapesToRemove.map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.destroyRecord();
            }),
          );
          await shape.destroyRecord();
        }),
      );
      savePromises.push(
        ...this.dimensionsToRemove.map((dimension) =>
          dimension.destroyRecord(),
        ),
      );

      savePromises.push(
        ...(await this.args.roadMarkingConcept.variables).map(
          async (variable) => {
            await this.store.request(saveRecord(variable));
          },
        ),
      );

      savePromises.push(
        ...this.variablesToRemove.map((variable) => variable.destroyRecord()),
      );

      await Promise.all(savePromises);
      await this.store.request(saveRecord(this.args.roadMarkingConcept));
      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        this.args.roadMarkingConcept.id,
      );
    }
  });

  @action
  setImage(model: TrafficSignalConcept, image: File) {
    super.setImage(model, image);
    void this.args.roadMarkingConcept.validateProperty('image');
  }

  @action
  async addVariable() {
    const newVariable = this.store.createRecord<Variable>('variable', {});
    (await this.args.roadMarkingConcept.variables).push(newVariable);
  }

  @action
  async removeVariable(variable: Variable) {
    const variables = await this.args.roadMarkingConcept.variables;
    removeItem(variables, variable);
    this.variablesToRemove.push(variable);
  }

  @action
  async toggleDefaultShape(shape: TribontShape) {
    const currentDefault = await this.args.roadMarkingConcept.defaultShape;
    if (currentDefault && currentDefault.id === shape.id) {
      this.args.roadMarkingConcept.set('defaultShape', null);
    } else {
      this.args.roadMarkingConcept.set('defaultShape', shape);
    }
  }

  willDestroy() {
    super.willDestroy();
    this.args.roadMarkingConcept.reset();
  }
}
