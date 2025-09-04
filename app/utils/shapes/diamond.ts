import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
  staticImplements,
  type Shape,
  type ShapeStatic,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type Store from '@ember-data/store';
import WidthShape from './width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

@staticImplements<ShapeStatic>()
export default class Diamond extends WidthShape implements Shape {
  static async createShape(
    unit: Unit,
    store: Store,
    trafficSignalConcept: TrafficSignalConcept,
  ) {
    const widthDimension = await createDimension(store, unit, DIMENSIONS.width);
    const dimensions = [widthDimension];

    const shape = await createStoreShape(
      store,
      dimensions,
      SHAPE_URIS.diamond,
      trafficSignalConcept,
    );
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
}
