import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsIndexRoute from 'mow-registry/routes/road-sign-concepts/index';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type IntlService from 'ember-intl/services/intl';
import { service } from '@ember/service';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = [
    'page',
    'size',
    'label',
    'meaning',
    'sort',
    'classifications',
    'validation',
    'arPlichtig',
    'validityOption',
    'validityStartDate',
    'validityEndDate',
  ];

  declare model: ModelFrom<RoadsignConceptsIndexRoute>;

  @service
  declare intl: IntlService;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked classification?: string | null;
  @tracked sort = 'label';
  @tracked validation?: string | null;
  @tracked arPlichtig?: string | null;
  @tracked validityOption?: string | null;
  @tracked validityStartDate?: string | null;
  @tracked validityEndDate?: string | null;

  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }
  get arPlichtigStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('ar-plichtig-status.ar-required') },
      {
        value: 'false',
        label: this.intl.t('ar-plichtig-status.ar-not-required'),
      },
    ];
  }

  get hasActiveFilter() {
    return Boolean(
      this.label ||
        this.meaning ||
        this.classification ||
        this.validation ||
        this.validityOption ||
        this.arPlichtig,
    );
  }

  updateSearchFilterTask = restartableTask(
    async (
      queryParamProperty: 'classification' | 'meaning',
      event: InputEvent,
    ) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  get selectedClassification() {
    if (!this.classification) {
      return null;
    }
    return this.model.classifications.find((classification) => {
      return classification.id === String(this.classification);
    });
  }

  @action
  updateCategoryFilter(selectedClassification: RoadSignCategory) {
    if (selectedClassification) {
      this.classification = selectedClassification.id;
      this.resetPagination();
    } else {
      this.classification = null;
    }
  }

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.validation,
    );
  }
  get selectedArPlichtigStatus() {
    return this.arPlichtigStatusOptions.find(
      (option) => option.value === this.arPlichtig,
    );
  }
  @action
  updateBooleanFilter(
    filterName: 'validation' | 'arPlichtig',
    selectedOption: typeof filterName extends 'validation'
      ? (typeof this.validationStatusOptions)[number]
      : (typeof this.arPlichtigStatusOptions)[number],
  ) {
    if (selectedOption) {
      this[filterName] = selectedOption.value;
      this.resetPagination();
    } else {
      this[filterName] = null;
    }
  }
  @action
  updateValidityFilter({ validityOption, startDate, endDate }) {
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

  resetFilters = () => {
    this.label = '';
    this.meaning = '';
    this.classification = null;
    this.validation = null;
    this.arPlichtig = null;
    this.validityOption = null;
    this.validityStartDate = null;
    this.validityEndDate = null;
    this.resetPagination();
  };

  resetPagination() {
    this.page = 0;
  }
}
