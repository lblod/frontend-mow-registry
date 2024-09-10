import Component from '@glimmer/component';
import { action } from '@ember/object';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
type Args = {
  concept: TrafficMeasureConcept;
};
export default class VariableSignageSelectorComponent extends Component<Args> {
  @action
  update(value: string) {
    this.args.concept.variableSignage = value;
  }
}
