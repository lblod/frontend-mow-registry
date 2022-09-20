import Component from '@glimmer/component';

export default class TrafficMeasureInstructionEntryComponent extends Component {
  get label() {
    return this.args.sign.roadSignConceptCode
      ? this.args.sign.roadSignConceptCode
      : this.args.sign.roadMarkingConceptCode
      ? this.args.sign.roadMarkingConceptCode
      : this.args.sign.trafficLightConceptCode;
  }
}
