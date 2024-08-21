import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import TribontShapeModel from 'mow-registry/models/tribont-shape';

export default class RoadSignShapeSelectComponent extends Component {
  @tracked selectedShape?: TribontShapeModel;

  @action
  setRoadSignConceptShape(selectedShape: TribontShapeModel) {
    this.selectedShape = selectedShape;
  }
}
