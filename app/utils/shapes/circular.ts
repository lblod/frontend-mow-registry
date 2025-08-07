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
  static async createDefaultShape(unit: Unit, store: Store) {
    const radiusKind = await store.findRecord<QuantityKind>(
      'quantity-kind',
      DIMENSIONS.radius,
    );
    const radiusDimension = store.createRecord<Dimension>('dimension', {
      value: 0,
      kind: radiusKind,
      unit,
    });
    await radiusDimension.save();
    const dimensions = [radiusDimension];

    const classification =
      await store.findRecord<TribontShapeClassificationCode>(
        'tribont-shape-classification-code',
        SHAPE_IDS.circular,
      );
    const shape = store.createRecord<TribontShape>('tribont-shape', {
      dimensions,
      classification,
    });
    await shape.save();
    const radius = await dimensionToShapeDimension(radiusDimension, 'radius');
    return new this(shape, radius);
  }
  async convertToNewUnit(unit: Unit) {
    this.radius.unit = unit;
    this.radius.dimension.set('unit', unit);
    await this.radius.dimension.save();
  }
}
