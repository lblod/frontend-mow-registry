import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_IDS,
  staticImplements,
  type Shape,
  type shapeDimension,
  type ShapeStatic,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type Store from '@ember-data/store';

@staticImplements<ShapeStatic>()
export default class Circular implements Shape {
  radius: shapeDimension;
  shape: TribontShape;
  constructor(shape: TribontShape, radius: shapeDimension) {
    this.radius = radius;
    this.shape = shape;
  }
  toString() {
    return `Breedte: ${this.radius.value} ${this.radius.unit.symbol}`;
  }
  get unitMeasure() {
    return this.radius.unit;
  }

  get id() {
    return this.shape.id as string;
  }

  static headers() {
    return [
      {
        label: 'radius',
        value: 'radius',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const radiusDimension = dimensions.find(
      (dimension) => dimension.kind.id === DIMENSIONS.radius,
    );
    if (!radiusDimension) return;
    const radius = await dimensionToShapeDimension(radiusDimension, 'radius');
    return new this(shape, radius);
  }
  static async createShape(unit: Unit, store: Store) {
    const radiusDimension = await createDimension(
      store,
      unit,
      DIMENSIONS.radius,
    );
    const dimensions = [radiusDimension];

    const shape = await createStoreShape(store, dimensions, SHAPE_IDS.circular);
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
