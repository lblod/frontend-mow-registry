import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

type Args = {
  concept: TrafficSignalConcept;
};
export default class ContentCheckComponent extends Component<Args> {
  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.args.concept.save();
  });
}
