import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import DimensionModel from 'mow-registry/models/dimension';
import TribontShapeModel from 'mow-registry/models/tribont-shape';

type Args = {
  selectedShape: TribontShapeModel;
};

interface ShapeDimension {
  label: string;
  dimensions: string;
  unitType: string;
}

export default class RoadSignAddDimensionComponent extends Component<Args> {
  @tracked value?: number;
  @tracked secondValue?: number;
  @tracked selectedUnitType?: string;
  @tracked shapeDimensionArray: ShapeDimension[] = [];

  unitTypes = ['m', 'mm', 'cm'];

  get isButtonDisabled(): boolean {
    const selectedShape = this.args.selectedShape.label;
    if (
      selectedShape === 'Groot bord' ||
      selectedShape === 'Wegwijzer met puntvorm'
    ) {
      return !(this.value && this.secondValue);
    } else {
      return !this.value;
    }
  }

  @action
  setValue(event: Event): void {
    this.value = parseInt((event.target as HTMLInputElement).value);
  }

  @action
  setSecondValue(event: Event): void {
    this.secondValue = parseInt((event.target as HTMLInputElement).value);
  }

  @action
  setUnitType(unitType: string): void {
    this.selectedUnitType = unitType;
  }

  @action
  addShapeAndDimensions() {
    const selectedShape = this.args.selectedShape.label;
    let dimensions = `${this.value} ${this.selectedUnitType}`;
    if (
      selectedShape === 'Groot bord' ||
      selectedShape === 'Wegwijzer met puntvorm'
    ) {
      dimensions = `${this.value} x ${this.secondValue} ${this.selectedUnitType}`;
    }

    this.shapeDimensionArray = [
      ...this.shapeDimensionArray,
      {
        label: selectedShape ?? '',
        dimensions: dimensions ?? '',
        unitType: this.selectedUnitType ?? '',
      },
    ];
  }
  @action
  removeShape(shapeToDelete: ShapeDimension): void {
    this.shapeDimensionArray = this.shapeDimensionArray.filter(
      (shape) => shape !== shapeToDelete,
    );
  }
}
