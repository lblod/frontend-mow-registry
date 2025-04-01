import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type IntlService from 'ember-intl/services/intl';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from '@ember-data/store';
import type { Collection } from 'mow-registry/utils/type-utils';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadmarkingConceptsIndexRoute from 'mow-registry/routes/road-marking-concepts/index';

export default class RoadmarkingConceptsIndexController extends Controller {
  @service declare store: Store;
  queryParams = [
    'page',
    'size',
    'label',
    'meaning',
    'sort',
    'validation',
    'arPlichtig',
    'validityOption',
    'validityStartDate',
    'validityEndDate',
  ];
  declare model: ModelFrom<RoadmarkingConceptsIndexRoute>;

  @service
  declare intl: IntlService;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked sort = ':no-case:label';
  @tracked validation?: string | null;
  @tracked arPlichtig?: string | null;
  @tracked validityOption?: string | null;
  @tracked validityStartDate?: string | null;
  @tracked validityEndDate?: string | null;
  @tracked _roadMarkings?: Collection<RoadMarkingConcept>;
  @tracked isLoadingModel?: boolean;

  get roadMarkings() {
    return this._roadMarkings
      ? this._roadMarkings
      : this.model.roadMarkingConcepts;
  }

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
    return (
      this.label ||
      this.meaning ||
      this.validation ||
      this.validityOption ||
      this.arPlichtig
    );
  }

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'label' | 'meaning', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
      await this.fetchData.perform();
    },
  );

  fetchData = restartableTask(async () => {
    this.isLoadingModel = true;
    const query: Record<string, unknown> = {
      sort: this.sort,
      filter: {},
    };
    const { uris: roadMarkingConceptUris, count } = await fetchManualData(
      'road-marking-concept',
      {
        page: this.page,
        size: this.size,
        label: this.label,
        meaning: this.meaning,
        sort: this.sort,
        validation: this.validation,
        arPlichtig: this.arPlichtig,
        validityOption: this.validityOption,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
      },
    );
    query['filter'] = {
      id: roadMarkingConceptUris.join(','),
    };
    const roadMarkings = roadMarkingConceptUris.length
      ? await this.store.query<RoadMarkingConcept>(
          'road-marking-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as unknown as Awaited<
          ReturnType<typeof this.store.query<RoadMarkingConcept>>
        >);
    roadMarkings.meta = generateMeta(
      { page: this.page, size: this.size },
      count,
    );
    roadMarkings.meta[count] = count;
    this._roadMarkings = roadMarkings;
    this.isLoadingModel = false;
  });

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

  resetFilters = () => {
    this.label = '';
    this.meaning = '';
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
