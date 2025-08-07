import Controller from '@ember/controller';
import { trackedFunction } from 'reactiveweb/function';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Owner from '@ember/owner';
import type ShapeClassification from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import ShapesRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/shapes';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type Shape from 'mow-registry/models/shape';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import {
  convertToShape,
  shapeDimensionToText,
  SHAPES,
} from 'mow-registry/utils/shapes';
export default class RoadSignConceptsRoadSignConceptShapesController extends Controller {
  declare model: ModelFrom<ShapesRoute>;
  @service declare store: Store;
  @tracked cardEditing = false;
  @tracked shapeChange?: ShapeClassification = undefined;
  @tracked unitChange?: Unit = undefined;
  shapeClassificationsPromise: Promise<ShapeClassification[]>;
  unitsPromise: Promise<Unit[]>;
  constructor(owner: Owner | undefined) {
    super(owner);
    this.shapeClassificationsPromise = this.fetchShapeClassifications();
    this.unitsPromise = this.fetchUnits();
  }

  get selectedShape() {
    return this.shapeChange ?? this.model.defaultShape.classification;
  }

  get selectedUnit() {
    return this.unitChange ?? this.defaultMeasureUnit;
  }

  get shapeClass() {
    const classificationId = this.model.defaultShape.classification.get('id');
    if (!classificationId) return;
    return SHAPES[classificationId as keyof typeof SHAPES];
  }

  async fetchShapeClassifications() {
    const classifications = await this.store.findAll<ShapeClassification>(
      'tribont-shape-classification-code',
    );

    return classifications;
  }

  async fetchUnits() {
    const units = await this.store.findAll<Unit>('unit');

    return units;
  }

  async fetchQuantityKind() {
    const quantityKind =
      await this.store.findAll<QuantityKind>('quantity-kind');

    return quantityKind;
  }

  get defaultShapeClassification() {
    return this.model.defaultShape.classification.get('label');
  }
  defaultShape = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapeConverted = await convertToShape(this.model.defaultShape);
    return shapeConverted;
  });
  shapesConverted = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapesConverted = [];
    for (const shape of this.model.shapes) {
      const shapeConverted = await convertToShape(shape);
      shapesConverted.push(shapeConverted);
    }
    return shapesConverted;
  });

  get defaultShapeString() {
    return this.defaultShape.value?.toString();
  }

  get defaultMeasureUnit() {
    console.log(this.defaultShape.value?.unitMeasure);
    return this.defaultShape.value?.unitMeasure;
  }

  get dimensionsToShow() {
    return this.shapeClass?.headers();
  }
  toggleEditing() {}

  editCard = () => {
    this.cardEditing = true;
  };

  saveCard = async () => {
    if (
      this.shapeChange &&
      this.shapeChange.id !== this.model.defaultShape.classification.id
    ) {
      //Show alert
      for (const shape of this.model.shapes) {
        await this.removeShape(shape);
      }
      const shapeClass = SHAPES[this.shapeChange.id as keyof typeof SHAPES];
      const shape = await shapeClass.createDefaultShape(
        this.selectedUnit,
        this.store,
      );
      this.model.roadSignConcept.set('defaultShape', shape.shape);
      this.model.roadSignConcept.set('shapes', [shape.shape]);
      await this.model.roadSignConcept.save();
    } else if (
      this.unitChange &&
      this.unitChange.id !== this.defaultMeasureUnit?.id &&
      this.shapesConverted.value
    ) {
      for (const shape of this.shapesConverted.value) {
        await shape?.convertToNewUnit(this.unitChange);
      }
    }
    this.cardEditing = false;
  };

  cancelCard = () => {
    this.cardEditing = false;
    this.unitChange = undefined;
    this.shapeChange = undefined;
  };

  getValue(shape: Shape, dimension: string) {
    if (!shape[dimension]) return '';
    return shapeDimensionToText(shape[dimension]);
  }

  setShapeClassifications = (classification) => {
    this.shapeChange = classification;
  };
  setUnit = (unit) => {
    this.unitChange = unit;
  };

  async removeShape(shape) {}
}
