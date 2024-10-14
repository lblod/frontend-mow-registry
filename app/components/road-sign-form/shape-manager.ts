import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Store from '@ember-data/store';
import Dimension from 'mow-registry/models/dimension';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type Shape from 'mow-registry/models/tribont-shape';
import TribontShape from 'mow-registry/models/tribont-shape';
import type ShapeClassification from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';

interface Signature {
  Args: {
    roadSignConcept: RoadSignConcept;
    shapes: Shape[];
    addShape: () => void;
    removeShape: (shapeToRemove: Shape) => void;
  };
}

export default class ShapeManager extends Component<Signature> {
  @service declare store: Store;
  @tracked units: Unit[] = [];
  unitsPromise: Promise<Unit[]>;
  shapeClassificationsPromise: Promise<ShapeClassification[]>;
  quantityKindsPromise: Promise<QuantityKind[]>;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.unitsPromise = this.fetchUnits();
    this.shapeClassificationsPromise = this.fetchShapeClassifications();
    this.quantityKindsPromise = this.fetchQuantityKinds();
    void this.ensureShapeData();
  }

  plusOne = (value: number) => {
    return value + 1;
  };

  get shouldPreventDeletion() {
    return this.args.shapes.length <= 1;
  }

  async ensureShapeData() {
    // Needed to work around the following error:
    // You attempted to update <RelatedCollection:tribont-shape>.length, but it had already been used previously in the same computation...
    await Promise.resolve();

    const shapes = this.args.shapes;

    if (shapes.length === 0) {
      const shape = this.store.createRecord<TribontShape>('tribont-shape', {
        dimensions: [this.store.createRecord<Dimension>('dimension', {})],
      });

      shapes.push(shape);
    }
  }

  async fetchUnits() {
    this.units = await this.store.findAll<Unit>('unit');

    return this.units;
  }

  async fetchShapeClassifications() {
    const classifications = await this.store.findAll<ShapeClassification>(
      'tribont-shape-classification-code',
    );

    return classifications;
  }

  fetchQuantityKinds() {
    return this.store.query<QuantityKind>('quantity-kind', {
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      include: 'units',
    });
  }

  addDimension = async (shape: TribontShape) => {
    (await shape.dimensions).push(
      this.store.createRecord<Dimension>('dimension', {}),
    );
  };

  setQuantityKind = async (dimension: Dimension, kind: QuantityKind) => {
    dimension.kind = kind;
    const newUnits = kind.units;
    const currentUnit = await dimension.unit;

    if (!currentUnit || !newUnits.includes(currentUnit)) {
      const defaultUnit = newUnits.find((unit) => unit.isDefaultUnit);
      dimension.set('unit', defaultUnit);
    }
  };

  setUnitType = (dimension: Dimension, unit: Unit) => {
    dimension.set('unit', unit);
  };

  setDimensionValue = (dimension: Dimension, event: Event) => {
    const newValue = (event.target as HTMLInputElement).valueAsNumber;
    dimension.value = !Number.isNaN(newValue) ? newValue : undefined;
  };
}
