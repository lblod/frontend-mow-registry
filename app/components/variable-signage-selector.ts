import Component from '@glimmer/component';
import { action } from '@ember/object';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

type Args = {
  concept: TrafficMeasureConcept;
};

type Value = 'yes' | 'no';

export default class VariableSignageSelectorComponent extends Component<Args> {
  get selected(): Value {
    return this.args.concept.variableSignage ? 'yes' : 'no';
  }

  @action
  update(value: Value) {
    this.args.concept.variableSignage = value === 'yes' ? true : false;
  }
}
