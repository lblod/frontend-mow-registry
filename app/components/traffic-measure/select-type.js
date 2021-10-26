import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class TrafficMeasureSelectTypeComponent extends Component {
  @service intl;
  @service store;

  @tracked types;

  constructor() {
    super(...arguments);
    this.fetchTypes.perform();
  }

  @task
  *fetchTypes() {
    let queryParams = {};
    let types = yield this.store.query('indicator-type', queryParams);
    this.types = types;
  }
}
