import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class ContentCheckComponent extends Component {
  update = task(async (value) => {
    this.args.concept.valid = value;
    await this.args.concept.save();
  });
}
