import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import TribontShapeModel from 'mow-registry/models/tribont-shape';

type Args = {
  selectedShape: TribontShapeModel;
};

interface ShapeDimension {
  label: string;
  dimensions: string;
}

export default class RoadSignAddDimensionComponent extends Component<Args> {
  @tracked value?: string;
  @tracked secondValue?: string;
  @tracked shapeDimensionArray: ShapeDimension[] = [];

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
    this.value = (event.target as HTMLInputElement).value;
  }

  @action
  setSecondValue(event: Event): void {
    this.secondValue = (event.target as HTMLInputElement).value;
  }

  @action
  addShapeAndDimensions() {
    const selectedShape = this.args.selectedShape.label;
    let dimensions = `${this.value} mm`;
    if (
      selectedShape === 'Groot bord' ||
      selectedShape === 'Wegwijzer met puntvorm'
    ) {
      dimensions = `${this.value} x ${this.secondValue} mm`;
    }

    this.shapeDimensionArray = [
      ...this.shapeDimensionArray,
      { label: selectedShape ?? '', dimensions: dimensions ?? '' },
    ];
  }
  @action
  removeShape(shapeToDelete: ShapeDimension): void {
    this.shapeDimensionArray = this.shapeDimensionArray.filter(
      (shape) => shape !== shapeToDelete,
    );
  }
}
