import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Concept from 'mow-registry/models/concept';

type Args = {
  concept: Concept;
};
export default class ContentCheckComponent extends Component<Args> {
  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.args.concept.save();
  });
}
