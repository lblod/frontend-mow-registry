import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TrafficMeasureInstructionEntryComponent extends Component {
  @tracked selectedInstruction;

  constructor() {
    super(...arguments);

    this.label = this.args.sign.roadSignConceptCode
      ? this.args.sign.roadSignConceptCode
      : this.args.sign.roadMarkingConceptCode
      ? this.args.sign.roadMarkingConceptCode
      : this.args.sign.trafficLightConceptCode;
  }
}
