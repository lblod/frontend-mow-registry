import Component from '@glimmer/component';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TrafficMeasureAddSignComponent extends Component {
  @service store;

  @tracked selected;

  @restartableTask
  *search(searchData) {
    yield timeout(300);

    let queryParams = {};
    queryParams[this.args.selectedType.searchFilter] = searchData;
    queryParams['sort'] = this.args.selectedType.sortingField;
    console.log(queryParams);
    let options = yield this.store.query(
      this.args.selectedType.modelName,
      queryParams
    );

    console.log(options);
    options.map(
      (option) => (option['label'] = option[this.args.selectedType.labelField])
    );
    return options;
  }

  @action
  select(selected) {
    this.selected = selected;
  }

  @action
  addSign(selected) {
    if (selected) {
      this.args.addSign(selected);
      this.selected = null;
    }
  }
}
