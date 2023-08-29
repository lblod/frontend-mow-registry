import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TrafficMeasureConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'code', 'template', 'sort'];

  @tracked page = 0;
  @tracked size = 30;
  @tracked code = '';
  @tracked template = null;
  @tracked sort = 'label';

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'code', event: InputEvent) => {
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

  resetPagination() {
    this.page = 0;
  }
}
