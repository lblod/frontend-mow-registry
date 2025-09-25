import {
  createDimension,
  createStoreShape,
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type { Store } from '@warp-drive/core';
import WidthShape from './width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

export default class Diamond extends WidthShape {
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
