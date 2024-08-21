import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import TribontShapeModel from 'mow-registry/models/tribont-shape';

type Args = {
  selectedShape: TribontShapeModel;
};

export default class RoadSignAddDimensionComponent extends Component<Args> {
  @tracked value?: string;
  @tracked secondValue?: string;

  get isButtonDisabled() {
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
}
