import {
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
  createDimension,
  createStoreShape,
} from '.';
import type { Store } from '@warp-drive/core';
import type Unit from 'mow-registry/models/unit';
import HeightAndWidhtShape from './height-and-width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

export default class InvertedTriangle extends HeightAndWidhtShape {
  static async createShape(
    unit: Unit,
    store: Store,
    trafficSignalConcept: TrafficSignalConcept,
  ) {
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
      SHAPE_URIS.invertedTriangle,
      trafficSignalConcept,
    );
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }
}
