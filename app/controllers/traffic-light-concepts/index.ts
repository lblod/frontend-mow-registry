import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type IntlService from 'ember-intl/services/intl';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from '@ember-data/store';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { trackedFunction } from 'reactiveweb/function';
import type { LegacyResourceQuery } from '@ember-data/store/types';

export default class TrafficlightConceptsIndexController extends Controller {
  queryParams = [
    'page',
    'size',
    'label',
    'meaning',
    'sort',
    'validation',
    'validityOption',
    'validityStartDate',
    'validityEndDate',
    'arPlichtig',
  ];

  @service
  declare intl: IntlService;
  @service
  declare store: Store;

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
        this.validation ||
        this.validityOption ||
        this.arPlichtig,
    );
  }

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'meaning' | 'label', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  trafficLights = trackedFunction(this, async () => {
    const query: LegacyResourceQuery<TrafficLightConcept> = {
      sort: this.sort,
      filter: {},
    };
    const { uris: trafficLightConceptUris, count } = await fetchManualData(
      'traffic-light-concept',
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
      id: trafficLightConceptUris.join(','),
    };
    await Promise.resolve();
    const trafficLights = trafficLightConceptUris.length
      ? await this.store.query<TrafficLightConcept>(
          'traffic-light-concept',
          query,
        )
      : ([] as TrafficLightConcept[] as Awaited<
          ReturnType<typeof this.store.query<TrafficLightConcept>>
        >);
    trafficLights.meta = generateMeta(
      { page: this.page, size: this.size },
      count,
    );
    trafficLights.meta[count] = count;
    return trafficLights;
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
