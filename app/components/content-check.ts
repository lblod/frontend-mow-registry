import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import ConceptModel from 'mow-registry/models/concept';

type Args = {
  concept: ConceptModel;
};
export default class ContentCheckComponent extends Component<Args> {
  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.args.concept.save();
  });
}
