import Component from '@glimmer/component';
import { action } from '@ember/object';
import TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';
type Args = {
  concept: TrafficMeasureConceptModel;
};
export default class TemporalSelectorComponent extends Component<Args> {
  @action
  update(value: string) {
    this.args.concept.temporal = value;
  }
}
