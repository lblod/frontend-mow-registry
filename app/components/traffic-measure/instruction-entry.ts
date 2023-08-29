import Component from '@glimmer/component';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

type Args = {
  sign:
    | RoadSignConceptModel
    | RoadMarkingConceptModel
    | TrafficLightConceptModel;
};
export default class TrafficMeasureInstructionEntryComponent extends Component<Args> {
  get label() {
    const { sign } = this.args;
    if ('roadSignConceptCode' in sign) {
      return sign.roadSignConceptCode;
    } else if ('roadMarkingConceptCode' in sign) {
      return sign.roadMarkingConceptCode;
    } else if ('trafficLightConceptCode' in sign) {
      return sign.trafficLightConceptCode;
    }
    return;
  }
}
