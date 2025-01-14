import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';

export default class RoadmarkingConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'meaning', 'sort', 'validation'];

  @service
  declare intl: IntlService;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked sort = ':no-case:label';
  @tracked validation?: string | null;

  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }
  get hasActiveFilter() {
    return Boolean(this.label || this.meaning || this.validation);
  }

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'label' | 'meaning', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.validation,
    );
  }
  @action
  updateValidationFilter(
    selectedValidationStatus: (typeof this.validationStatusOptions)[number],
  ) {
    if (selectedValidationStatus) {
      this.validation = selectedValidationStatus.value;
      this.resetPagination();
    } else {
      this.validation = null;
    }
  }
  @action onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action onSortChange(newSort: string) {
    this.sort = newSort;
  }

  resetFilters = () => {
    this.label = '';
    this.meaning = '';
    this.validation = null;
    this.resetPagination();
  };

  resetPagination() {
    this.page = 0;
  }
}
