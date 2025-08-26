import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type ShapeStatic,
  type Shape,
  SHAPE_IDS,
  staticImplements,
  createStoreShape,
  createDimension,
} from '.';
import type Store from '@ember-data/store';
import type Unit from 'mow-registry/models/unit';
import HeightAndWidhtShape from './heightAndWidthShape';

@staticImplements<ShapeStatic>()
export default class SignpostWithPoint
  extends HeightAndWidhtShape
  implements Shape
{
  static async createShape(unit: Unit, store: Store) {
    const heightDimension = await createDimension(
      store,
      unit,
      DIMENSIONS.height,
    );
    const widthDimension = await createDimension(store, unit, DIMENSIONS.width);
    const dimensions = [heightDimension, widthDimension];

    const shape = await createStoreShape(
      store,
      dimensions,
      SHAPE_IDS.signpostWithPoint,
    );
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }
}
