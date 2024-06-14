import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RoadmarkingConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'meaning', 'sort'];

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked sort = 'label';

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'label' | 'meaning', event: InputEvent) => {
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
