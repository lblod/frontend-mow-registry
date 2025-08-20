import type TribontShape from 'mow-registry/models/tribont-shape';
import Octagon from './octagon';
import Dimension from 'mow-registry/models/dimension';
import Rectangle from './rectangle';
import type Unit from 'mow-registry/models/unit';
import type Store from '@ember-data/store';
import SignpostWithPoint from './signpostWithPoint';
import InvertedTriangle from './invertedTriangle';
import Triangle from './triangle';
import Circular from './circular';
import Diamond from './diamond';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import type TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';

export const DIMENSIONS = {
  length: '3ab17bee-f370-447c-849f-436ad2a98fb1',
  angle: '8cf226fc-34cd-4120-a872-087e5af29f78',
  height: 'c6fad555-39d4-4c75-bd96-bb7c006bdc2c',
  width: '6f2325ca-d4ea-4686-a70f-548b152bfbed',
  radius: '84239754-a25a-482e-9035-e602a998e6e9',
};

export const DIMENSION_LABELS = {
  '3ab17bee-f370-447c-849f-436ad2a98fb1': 'Lengte',
  '8cf226fc-34cd-4120-a872-087e5af29f78': 'Hoek',
  'c6fad555-39d4-4c75-bd96-bb7c006bdc2c': 'Hoogte',
  '6f2325ca-d4ea-4686-a70f-548b152bfbed': 'Breedte',
  '84239754-a25a-482e-9035-e602a998e6e9': 'Straal',
};

export const SHAPES = {
  'a5a1b947-1c34-40df-8842-707de418adb8': Rectangle,
  '4f445b8f-98ce-4621-b671-009a1acb13a6': SignpostWithPoint,
  '10b19729-8b4a-4ea5-8470-bc34fc204791': InvertedTriangle,
  '1cddd186-6018-4d12-84d6-f1a5d01affde': Triangle,
  '0e0897d1-5c74-47ae-9868-adecbde6f2f3': Octagon,
  '2481e377-1a89-4e25-9c58-1b509e0f7d74': Circular,
  '322852b4-ec7b-4ca2-b267-4fcc263fa0d7': Diamond,
};

export const SHAPE_IDS = {
  rectangle: 'a5a1b947-1c34-40df-8842-707de418adb8',
  signpostWithPoint: '4f445b8f-98ce-4621-b671-009a1acb13a6',
  invertedTriangle: '10b19729-8b4a-4ea5-8470-bc34fc204791',
  triangle: '1cddd186-6018-4d12-84d6-f1a5d01affde',
  octagon: '0e0897d1-5c74-47ae-9868-adecbde6f2f3',
  circular: '2481e377-1a89-4e25-9c58-1b509e0f7d74',
  diamond: '322852b4-ec7b-4ca2-b267-4fcc263fa0d7',
};

export type shapeDimension = {
  dimension: Dimension;
  value: number;
  kind: string;
  unit: Unit;
};

export async function dimensionToShapeDimension(
  dimension: Dimension,
  kind: keyof typeof DIMENSIONS,
): Promise<shapeDimension> {
  const unit = await dimension.unit;
  return {
    dimension: dimension,
    value: dimension.value ?? 0,
    kind: DIMENSIONS[kind],
    unit: unit as Unit,
  };
}

export interface ShapeStatic {
  headers(): { label: string; value: string }[];
  fromShape(shape: TribontShape): Promise<Shape | undefined>;
  createDefaultShape(unit: Unit, store: Store): Promise<Shape>;
}

export interface Shape {
  shape: TribontShape;
  toString(): string;
  unitMeasure: Unit;
  convertToNewUnit(unit: Unit): Promise<void>;
  id: string;
  save(): Promise<void>;
  reset(): Promise<void>;
}

export async function convertToShape(shape: TribontShape) {
  const classificationId = (await shape.classification)?.get('id');
  if (!classificationId) return;
  const shapeClass: ShapeStatic =
    SHAPES[classificationId as keyof typeof SHAPES];
  const shapeConverted = shapeClass.fromShape(shape);
  return shapeConverted;
}

export function shapeDimensionToText(dimension: shapeDimension) {
  return `${dimension.value} ${dimension.unit.symbol}`;
}

/* class decorator */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export async function createDimension(
  store: Store,
  unit: Unit,
  dimensionId: string,
) {
  const kind = await store.findRecord<QuantityKind>(
    'quantity-kind',
    dimensionId,
  );
  const dimension = store.createRecord<Dimension>('dimension', {
    value: 0,
    kind: kind,
    unit,
  });
  await dimension.save();
  return dimension;
}

export async function createStoreShape(
  store: Store,
  dimensions: Dimension[],
  shapeId: string,
) {
  const classification = await store.findRecord<TribontShapeClassificationCode>(
    'tribont-shape-classification-code',
    shapeId,
  );
  const shape = store.createRecord<TribontShape>('tribont-shape', {
    dimensions,
    classification,
  });
  await shape.save();
  return shape;
}
