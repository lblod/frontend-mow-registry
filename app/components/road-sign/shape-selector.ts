import { action } from '@ember/object';
import Component from '@glimmer/component';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};

export default class RoadSignShapeSelectorComponent extends Component<Args> {
  @action
  async setRoadSignConceptShape(selection: RoadSignConceptModel) {
    console.log('this.args.roadSignConcept', this.args.roadSignConcept);
    this.args.roadSignConcept.set('shape', selection);
    await this.args.roadSignConcept.validateProperty('shape');
  }

  @action
  async setRoadSignConceptDimensions() {
    //TODO: validate dimensions
  }
}
