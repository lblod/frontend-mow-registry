import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type IntlService from 'ember-intl/services/intl';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from '@ember-data/store';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { trackedFunction } from 'reactiveweb/function';
import type { LegacyResourceQuery } from '@ember-data/store/types';

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
    },
  );

  roadMarkings = trackedFunction(this, async () => {
    const query: LegacyResourceQuery<RoadMarkingConcept> = {
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
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const roadMarkings = roadMarkingConceptUris.length
      ? await this.store.query<RoadMarkingConcept>(
          'road-marking-concept',
          query,
        )
      : ([] as RoadMarkingConcept[] as Awaited<
          ReturnType<typeof this.store.query<RoadMarkingConcept>>
        >);
    roadMarkings.meta = generateMeta(
      { page: this.page, size: this.size },
      count,
    );
    roadMarkings.meta[count] = count;
    return roadMarkings;
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
