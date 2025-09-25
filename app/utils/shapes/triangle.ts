import {
  DIMENSIONS,
  dimensionToShapeDimension,
  SHAPE_URIS,
  createStoreShape,
  createDimension,
} from '.';
import type Unit from 'mow-registry/models/unit';
import HeightAndWidhtShape from './height-and-width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { Store } from '@warp-drive/core';

export default class Triangle extends HeightAndWidhtShape {
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
      SHAPE_URIS.triangle,
      trafficSignalConcept,
    );
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }
}
