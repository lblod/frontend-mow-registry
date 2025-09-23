import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type ShapeStatic,
  type Shape,
  SHAPE_URIS,
  staticImplements,
  createStoreShape,
  createDimension,
} from '.';
import type Unit from 'mow-registry/models/unit';
import HeightAndWidhtShape from './height-and-width-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { Store } from '@warp-drive/core';

@staticImplements<ShapeStatic>()
export default class Triangle extends HeightAndWidhtShape implements Shape {
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
