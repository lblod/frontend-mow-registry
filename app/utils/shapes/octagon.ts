import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_IDS,
  staticImplements,
  type Shape,
  type ShapeStatic,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type Store from '@ember-data/store';
import WidthShape from './widthShape';

@staticImplements<ShapeStatic>()
export default class Octagon extends WidthShape implements Shape {
  static async createShape(unit: Unit, store: Store) {
    const widthDimension = await createDimension(store, unit, DIMENSIONS.width);
    const dimensions = [widthDimension];

    const shape = await createStoreShape(store, dimensions, SHAPE_IDS.octagon);
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
}
