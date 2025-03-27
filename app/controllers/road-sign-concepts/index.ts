import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsIndexRoute from 'mow-registry/routes/road-sign-concepts/index';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type IntlService from 'ember-intl/services/intl';
import { service } from '@ember/service';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from '@ember-data/store';
import type { Collection } from 'mow-registry/utils/type-utils';

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
  @service
  declare store: Store;

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
  @tracked _roadsigns?: Collection<RoadSignConcept>;
  @tracked isLoadingModel?: boolean;

  get roadsigns() {
    return this._roadsigns ? this._roadsigns : this.model.roadSignConcepts;
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
      await timeout(1000);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
      await this.fetchData.perform();
    },
  );

  fetchData = restartableTask(async () => {
    this.isLoadingModel = true;
    const query: Record<string, unknown> = {
      include: 'image.file,classifications',
      sort: this.sort,
      filter: {},
    };
    const { uris: roadsignConceptUris, count } = await fetchManualData(
      'road-sign-concept',
      {
        page: this.page,
        size: this.size,
        label: this.label,
        meaning: this.meaning,
        classification: this.classification,
        sort: this.sort,
        validation: this.validation,
        arPlichtig: this.arPlichtig,
        validityOption: this.validityOption,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
      },
    );
    query['filter'] = {
      id: roadsignConceptUris.join(','),
    };
    const roadsigns = roadsignConceptUris.length
      ? await this.store.query<RoadSignConcept>(
          'road-sign-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as Collection<RoadSignConcept>);
    roadsigns.meta = generateMeta({ page: this.page, size: this.size }, count);
    roadsigns.meta.count = count;
    this._roadsigns = roadsigns;
    this.isLoadingModel = false;
  });

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
