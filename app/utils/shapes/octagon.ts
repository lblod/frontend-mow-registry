import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
  staticImplements,
  type ShapeStatic,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type { Store } from '@warp-drive/core';
import WidthShape from './width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

@staticImplements<ShapeStatic>()
export default class Octagon extends WidthShape {
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
      SHAPE_URIS.octagon,
      trafficSignalConcept,
    );
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }
}
