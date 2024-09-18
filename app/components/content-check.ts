import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';

type Args = {
  trafficSignConcept: TrafficSignConcept;
};
export default class ContentCheckComponent extends Component<Args> {
  update = task(async (value: boolean) => {
    this.args.trafficSignConcept.valid = value;
    await this.args.trafficSignConcept.save();
  });
}
