import TribontShape from 'mow-registry/models/tribont-shape';
import Octagon from './octagon';
import Dimension from 'mow-registry/models/dimension';
import Rectangle from './rectangle';
import type Unit from 'mow-registry/models/unit';
import SignpostWithPoint from './signpost-with-point';
import InvertedTriangle from './inverted-triangle';
import Triangle from './triangle';
import Circular from './circular';
import Diamond from './diamond';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import type TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';
import type IntlService from 'ember-intl/services/intl';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { Store } from '@warp-drive/core';
import { query } from '@warp-drive/legacy/compat/builders';

export const DIMENSIONS = {
  length: 'http://qudt.org/vocab/quantitykind/Length',
  angle: 'http://qudt.org/vocab/quantitykind/Angle',
  height: 'http://qudt.org/vocab/quantitykind/Height',
  width: 'http://qudt.org/vocab/quantitykind/Width',
  radius: 'http://qudt.org/vocab/quantitykind/Radius',
};

export const DIMENSION_LABELS = {
  'http://qudt.org/vocab/quantitykind/Length': 'Lengte',
  'http://qudt.org/vocab/quantitykind/Angle': 'Hoek',
  'http://qudt.org/vocab/quantitykind/Height': 'Hoogte',
  'http://qudt.org/vocab/quantitykind/Width': 'Breedte',
  'http://qudt.org/vocab/quantitykind/Radius': 'Straal',
};

export const SHAPES = {
  'http://data.lblod.info/concept-schemes/a5a1b947-1c34-40df-8842-707de418adb8':
    Rectangle,
  'http://data.lblod.info/concept-schemes/4f445b8f-98ce-4621-b671-009a1acb13a6':
    SignpostWithPoint,
  'http://data.lblod.info/concept-schemes/10b19729-8b4a-4ea5-8470-bc34fc204791':
    InvertedTriangle,
  'http://lblod.data.gift/concept-schemes/1cddd186-6018-4d12-84d6-f1a5d01affde':
    Triangle,
  'http://data.lblod.info/concept-schemes/0e0897d1-5c74-47ae-9868-adecbde6f2f3':
    Octagon,
  'http://data.lblod.info/concept-schemes/2481e377-1a89-4e25-9c58-1b509e0f7d74':
    Circular,
  'http://data.lblod.info/concept-schemes/322852b4-ec7b-4ca2-b267-4fcc263fa0d7':
    Diamond,
};

export const SHAPE_URIS = {
  rectangle:
    'http://data.lblod.info/concept-schemes/a5a1b947-1c34-40df-8842-707de418adb8',
  signpostWithPoint:
    'http://data.lblod.info/concept-schemes/4f445b8f-98ce-4621-b671-009a1acb13a6',
  invertedTriangle:
    'http://data.lblod.info/concept-schemes/10b19729-8b4a-4ea5-8470-bc34fc204791',
  triangle:
    'http://lblod.data.gift/concept-schemes/1cddd186-6018-4d12-84d6-f1a5d01affde',
  octagon:
    'http://data.lblod.info/concept-schemes/0e0897d1-5c74-47ae-9868-adecbde6f2f3',
  circular:
    'http://data.lblod.info/concept-schemes/2481e377-1a89-4e25-9c58-1b509e0f7d74',
  diamond:
    'http://data.lblod.info/concept-schemes/322852b4-ec7b-4ca2-b267-4fcc263fa0d7',
};

export class ShapeDimension {
  dimension: Dimension;
  kind: string;
  unit: Unit;
  constructor({
    dimension,
    kind,
    unit,
  }: {
    dimension: Dimension;
    kind: string;
    unit: Unit;
  }) {
    this.dimension = dimension;
    this.kind = kind;
    this.unit = unit;
  }
  set value(value: number) {
    this.dimension.value = value;
  }
  get value(): number | undefined {
    return this.dimension.value;
  }
}

export async function dimensionToShapeDimension(
  dimension: Dimension,
  kind: keyof typeof DIMENSIONS,
): Promise<ShapeDimension> {
  const unit = await dimension.unit;
  return new ShapeDimension({
    dimension: dimension,
    kind: DIMENSIONS[kind],
    unit: unit as Unit,
  });
}

export interface ShapeStatic {
  headers(intln: IntlService): { label: string; value: string }[];
  fromShape(shape: TribontShape): Promise<Shape | undefined>;
  createShape(
    unit: Unit,
    store: Store,
    trafficSignalConcept: TrafficSignalConcept,
  ): Promise<Shape>;
}

export type Shape = {
  [dimension in keyof typeof DIMENSIONS]?: ShapeDimension;
} & {
  shape: TribontShape;
  toString(intl: IntlService): string;
  unitMeasure: Unit;
  convertToNewUnit(unit: Unit, store: Store): Promise<void>;
  id: string;
  validateAndsave(store: Store): Promise<boolean>;
  reset(): Promise<void>;
  remove(store: Store): Promise<void>;
};

export async function convertToShape(shape: TribontShape) {
  const classificationUri = (await shape.classification)?.get('uri');
  if (!classificationUri) return;
  const shapeClass: ShapeStatic =
    SHAPES[classificationUri as keyof typeof SHAPES];
  const shapeConverted = await shapeClass.fromShape(shape);
  return shapeConverted;
}

export function shapeDimensionToText(dimension: ShapeDimension) {
  return `${dimension.value} ${dimension.unit.symbol}`;
}

/* class decorator to allow define a type to include all the static methods of the class */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export async function createDimension(
  store: Store,
  unit: Unit,
  dimensionUri: string,
) {
  const kind = (
    await store
      .request(
        query<QuantityKind>('quantity-kind', {
          filter: {
            ':uri:': dimensionUri,
          },
        }),
      )
      .then((res) => res.content)
  )[0];
  const dimension = store.createRecord<Dimension>('dimension', {
    kind: kind,
    unit,
  });
  return dimension;
}

export async function createStoreShape(
  store: Store,
  dimensions: Dimension[],
  shapeUri: string,
  trafficSignalConcept: TrafficSignalConcept,
) {
  const classification = (
    await store
      .request(
        query<TribontShapeClassificationCode>(
          'tribont-shape-classification-code',
          {
            filter: {
              ':uri:': shapeUri,
            },
          },
        ),
      )
      .then((res) => res.content)
  )[0];
  const shape = store.createRecord<TribontShape>('tribont-shape', {
    dimensions,
    classification,
    trafficSignalConcept,
    createdOn: new Date(),
  });
  return shape;
}
