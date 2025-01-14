import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficlightConceptsIndexRoute from 'mow-registry/routes/traffic-light-concepts/index';

export default class TrafficlightConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'meaning', 'sort'];
  declare model: ModelFrom<TrafficlightConceptsIndexRoute>;
  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked sort = ':no-case:label';

  get hasActiveFilter() {
    return Boolean(this.label || this.meaning);
  }

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'meaning' | 'label', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  @action onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action onSortChange(newSort: string) {
    this.sort = newSort;
  }

  resetFilters = () => {
    this.label = '';
    this.meaning = '';
    this.resetPagination();
  };

  resetPagination() {
    this.page = 0;
  }
}
