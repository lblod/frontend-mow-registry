import type TribontShape from 'mow-registry/models/tribont-shape';
import {
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
  static async createDefaultShape(unit: Unit, store: Store) {
    const widthKind = await store.findRecord<QuantityKind>(
      'quantity-kind',
      DIMENSIONS.width,
    );
    const widthDimension = store.createRecord<Dimension>('dimension', {
      value: 0,
      kind: widthKind,
      unit,
    });
    await widthDimension.save();
    const dimensions = [widthDimension];

    const classification =
      await store.findRecord<TribontShapeClassificationCode>(
        'tribont-shape-classification-code',
        SHAPE_IDS.diamond,
      );
    const shape = store.createRecord<TribontShape>('tribont-shape', {
      dimensions,
      classification,
    });
    await shape.save();
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
  async convertToNewUnit(unit: Unit) {
    this.width.unit = unit;
    this.width.dimension.set('unit', unit);
    await this.width.dimension.save();
  }
}
