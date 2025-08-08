import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type shapeDimension,
  type ShapeStatic,
  type Shape,
  SHAPE_IDS,
  staticImplements,
  createStoreShape,
  createDimension,
} from '.';
import type Store from '@ember-data/store';
import QuantityKind from 'mow-registry/models/quantity-kind';
import type Dimension from 'mow-registry/models/dimension';
import type Unit from 'mow-registry/models/unit';
import type TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';

@staticImplements<ShapeStatic>()
export default class Triangle implements Shape {
  height: shapeDimension;
  width: shapeDimension;
  shape: TribontShape;
  constructor(
    shape: TribontShape,
    height: shapeDimension,
    width: shapeDimension,
  ) {
    this.height = height;
    this.width = width;
    this.shape = shape;
  }
  toString() {
    return `Hoogte: ${this.height.value} ${this.height.unit.symbol} Breedte: ${this.width.value} ${this.width.unit.symbol}`;
  }
  get unitMeasure() {
    return this.height.unit;
  }

  static headers() {
    return [
      {
        label: 'Hoogte',
        value: 'height',
      },
      {
        label: 'Breedte',
        value: 'width',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const heightDimension = dimensions.find(
      (dimension) => dimension.kind.id === DIMENSIONS.height,
    );
    const widthDimension = dimensions.find(
      (dimension) => dimension.kind.id === DIMENSIONS.width,
    );
    if (!heightDimension || !widthDimension) return;
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }
  static async createDefaultShape(unit: Unit, store: Store) {
    const heightDimension = await createDimension(
      store,
      unit,
      DIMENSIONS.height,
    );
    const widthDimension = await createDimension(
      store,
      unit,
      DIMENSIONS.height,
    );
    const dimensions = [heightDimension, widthDimension];

    const shape = await createStoreShape(store, dimensions, SHAPE_IDS.triangle);
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }
  async convertToNewUnit(unit: Unit) {
    this.height.unit = unit;
    this.width.unit = unit;
    this.height.dimension.set('unit', unit);
    await this.height.dimension.save();
    this.width.dimension.set('unit', unit);
    await this.width.dimension.save();
  }
}
