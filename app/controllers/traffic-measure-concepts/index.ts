import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Template from 'mow-registry/models/template';

export default class TrafficMeasureConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'template', 'sort', 'templateValue'];

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked template?: Template | null;
  @tracked templateValue = '';
  @tracked sort = ':no-case:label';

  updateSearchFilterTask = restartableTask(
    async (
      queryParamProperty: 'label' | 'templateFilter',
      event: InputEvent,
    ) => {
      await timeout(300);

      const target = event.target as HTMLInputElement | undefined;
      const searchValue = target?.value || '';

      if (queryParamProperty === 'label') {
        this.label = searchValue;
      } else if (queryParamProperty === 'templateFilter') {
        this.templateValue = searchValue;
      }

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
