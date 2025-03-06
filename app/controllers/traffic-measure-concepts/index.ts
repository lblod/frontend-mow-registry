import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Template from 'mow-registry/models/template';

export default class TrafficMeasureConceptsIndexController extends Controller {
  queryParams = [
    'page',
    'size',
    'label',
    'template',
    'sort',
    'templateValue',
    'validityOption',
    'validityStartDate',
    'validityEndDate',
  ];

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked template?: Template | null;
  @tracked templateValue = '';
  @tracked sort = ':no-case:label';
  @tracked validityOption?: string | null;
  @tracked validityStartDate?: string | null;
  @tracked validityEndDate?: string | null;

  get hasActiveFilter() {
    return Boolean(this.label || this.templateValue || this.validityOption);
  }

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

  @action
  updateValidityFilter({
    validityOption,
    startDate,
    endDate,
  }: {
    validityOption: string;
    startDate: string;
    endDate: string;
  }) {
    this.validityOption = validityOption;
    this.validityStartDate = startDate;
    this.validityEndDate = endDate;
    this.resetPagination();
  }

  @action onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action onSortChange(newSort: string) {
    this.sort = newSort;
  }

  resetPagination() {
    this.page = 0;
  }
  resetFilters = () => {
    this.label = '';
    this.templateValue = '';
    this.validityOption = null;
    this.validityStartDate = null;
    this.validityEndDate = null;
    this.resetPagination();
  };
}
