import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { Collection, ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsIndexRoute from 'mow-registry/routes/road-sign-concepts/index';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type IntlService from 'ember-intl/services/intl';
import { service } from '@ember/service';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from 'mow-registry/services/store';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { trackedFunction } from 'reactiveweb/function';
import type { LegacyResourceQuery } from '@warp-drive/core/types';
import { query } from '@warp-drive/legacy/compat/builders';

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
  @tracked zonality?: [{ value: string; label: string }] | null;

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

  get zonalityOptions() {
    return [
      { value: 'zonal', label: this.intl.t('utility.zonal') },
      {
        value: 'non-zonal',
        label: this.intl.t('utility.nonZonal'),
      },
      {
        value: 'potentially-zonal',
        label: this.intl.t('utility.potentiallyZonal'),
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
        this.arPlichtig ||
        this.zonality,
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

  roadSigns = trackedFunction(this, async () => {
    const queryParams: LegacyResourceQuery<RoadSignConcept> = {
      include: ['image.file', 'classifications'],
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
        zonality: this.zonality?.map((zonalityOption) => zonalityOption.value),
      },
    );

    queryParams['filter'] = {
      id: roadsignConceptUris.join(','),
    };

    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    try {
      const roadSigns = (
        roadsignConceptUris.length
          ? (
              await this.store.request(
                query<RoadSignConcept>('road-sign-concept', queryParams),
              )
            ).content
          : []
      ) as Collection<RoadSignConcept>;
      roadSigns.meta = generateMeta(
        { page: this.page, size: this.size },
        count,
      );
      roadSigns.meta[count] = count;
      return roadSigns;
    } catch (e) {
      console.error(e);
    }
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

  @action
  updateZonalityFilter(selectedOption: [{ value: string; label: string }]) {
    if (selectedOption) {
      this.zonality = selectedOption;
      this.resetPagination();
    } else {
      this.zonality = undefined;
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
    this.classification = null;
    this.validation = null;
    this.arPlichtig = null;
    this.validityOption = null;
    this.validityStartDate = null;
    this.validityEndDate = null;
    this.zonality = null;
    this.resetPagination();
  };

  resetPagination() {
    this.page = 0;
  }
}
