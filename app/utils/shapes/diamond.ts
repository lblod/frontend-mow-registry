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
import type TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import type Store from '@ember-data/store';
import type Dimension from 'mow-registry/models/dimension';
import type QuantityKind from 'mow-registry/models/quantity-kind';

@staticImplements<ShapeStatic>()
export default class Diamond implements Shape {
  width: shapeDimension;
  shape: TribontShape;
  constructor(shape: TribontShape, width: shapeDimension) {
    this.width = width;
    this.shape = shape;
  }
  toString() {
    return `Breedte: ${this.width.value} ${this.width.unit.symbol}`;
  }
  get unitMeasure() {
    return this.width.unit;
  }

  get id() {
    return this.shape.id as string;
  }

  static headers() {
    return [
      {
        label: 'Breedte',
        value: 'width',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const widthDimension = dimensions.find(
      (dimension) => dimension.kind.id === DIMENSIONS.width,
    );
    if (!widthDimension) return;
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
  static async createShape(unit: Unit, store: Store) {
    const widthDimension = await createDimension(store, unit, DIMENSIONS.width);
    const dimensions = [widthDimension];

    const shape = await createStoreShape(store, dimensions, SHAPE_IDS.diamond);
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
  async convertToNewUnit(unit: Unit) {
    this.width.unit = unit;
    this.width.dimension.set('unit', unit);
    await this.width.dimension.save();
  }

  async save() {
    await this.width.dimension.save();
    await this.shape.save();
  }

  async reset() {
    this.width.dimension.rollbackAttributes();
    this.width = await dimensionToShapeDimension(this.width.dimension, 'width');
    this.shape.rollbackAttributes();
  }
  async remove() {
    this.width.dimension.deleteRecord();
    await this.width.dimension.save();
    this.shape.deleteRecord();
    await this.shape.save();
  }
}
