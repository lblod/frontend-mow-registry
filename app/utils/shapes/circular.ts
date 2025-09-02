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
import type Store from '@ember-data/store';
import type IntlService from 'ember-intl/services/intl';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

@staticImplements<ShapeStatic>()
export default class Circular implements Shape {
  radius: shapeDimension;
  shape: TribontShape;
  constructor(shape: TribontShape, radius: shapeDimension) {
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
      (dimension) => dimension.kind.uri === DIMENSIONS.radius,
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
  async convertToNewUnit(unit: Unit) {
    this.radius.unit = unit;
    this.radius.dimension.set('unit', unit);
    await this.radius.dimension.save();
  }

  async save() {
    await this.radius.dimension.save();
    await this.shape.save();
  }

  async reset() {
    this.radius.dimension.rollbackAttributes();
    this.radius = await dimensionToShapeDimension(
      this.radius.dimension,
      'radius',
    );
    this.shape.rollbackAttributes();
  }
  async remove() {
    this.radius.dimension.deleteRecord();
    await this.radius.dimension.save();
    this.shape.deleteRecord();
    await this.shape.save();
  }
}
