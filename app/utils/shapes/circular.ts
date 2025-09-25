import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
  staticImplements,
  type Shape,
  type shapeDimension,
  type ShapeStatic,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type { Store } from '@warp-drive/core';
import type IntlService from 'ember-intl/services/intl';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

@staticImplements<ShapeStatic>()
export default class Circular implements Shape {
  radius: shapeDimension;
  shape: TribontShape;
  private constructor(shape: TribontShape, radius: shapeDimension) {
    this.radius = radius;
    this.shape = shape;
  }
  toString(intl: IntlService) {
    return `${intl.t('shape-manager.radius')}: ${this.radius.value} ${this.radius.unit.symbol}`;
  }
  get unitMeasure() {
    return this.radius.unit;
  }

  get id() {
    return this.shape.id as string;
  }

  static headers(intl: IntlService) {
    return [
      {
        label: intl.t('shape-manager.radius'),
        value: 'radius',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const radiusDimension = dimensions.find(
      (dimension) => dimension.kind?.uri === DIMENSIONS.radius,
    );
    if (!radiusDimension) return;
    const radius = await dimensionToShapeDimension(radiusDimension, 'radius');
    return new this(shape, radius);
  }
  static async createShape(
    unit: Unit,
    store: Store,
    trafficSignalConcept: TrafficSignalConcept,
  ) {
    const radiusDimension = await createDimension(
      store,
      unit,
      DIMENSIONS.radius,
    );
    const dimensions = [radiusDimension];

    const shape = await createStoreShape(
      store,
      dimensions,
      SHAPE_URIS.circular,
      trafficSignalConcept,
    );
    const radius = await dimensionToShapeDimension(radiusDimension, 'radius');
    return new this(shape, radius);
  }
  async convertToNewUnit(unit: Unit, store: Store) {
    this.radius.unit = unit;
    this.radius.dimension.set('unit', unit);
    await store.request(saveRecord(this.radius.dimension));
  }

  async validateAndsave(store: Store) {
    const radiusValid = await this.radius.dimension.validate();
    const shapeValid = await this.shape.validate();
    if (radiusValid && shapeValid) {
      await store.request(saveRecord(this.radius.dimension));
      await store.request(saveRecord(this.shape));
      return true;
    }
    return false;
  }

  async reset() {
    this.radius.dimension.reset();
    this.radius = await dimensionToShapeDimension(
      this.radius.dimension,
      'radius',
    );
    this.shape.reset();
  }
  async remove(store: Store) {
    this.radius.dimension.deleteRecord();
    await store.request(saveRecord(this.radius.dimension));

    this.shape.deleteRecord();
    await store.request(saveRecord(this.shape));
  }
}
