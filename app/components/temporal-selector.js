import Component from '@glimmer/component';
import { action } from '@ember/object';
export default class TemporalSelectorComponent extends Component {
  @action
  update(value) {
    this.args.concept.temporal = value;
  }
}
