import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class ContentCheckComponent extends Component {
  @task
  *update(value) {
    this.args.concept.valid = value;
    yield this.args.concept.save();
  }
}
