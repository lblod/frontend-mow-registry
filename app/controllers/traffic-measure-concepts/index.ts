import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Template from 'mow-registry/models/template';
import type IntlService from 'ember-intl/services/intl';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from '@ember-data/store';
import type { Collection } from 'mow-registry/utils/type-utils';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type TrafficMeasureConceptsIndexRoute from 'mow-registry/routes/traffic-measure-concepts/index';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

export default class TrafficMeasureConceptsIndexController extends Controller {
  queryParams = [
    'page',
    'size',
    'label',
    'template',
    'sort',
    'validation',
    'templateValue',
    'validityOption',
    'validityStartDate',
    'validityEndDate',
  ];

  declare model: ModelFrom<TrafficMeasureConceptsIndexRoute>;

  @service
  declare intl: IntlService;
  @service
  declare store: Store;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked template?: Template | null;
  @tracked templateValue = '';
  @tracked sort = ':no-case:label';
  @tracked validation?: string | null;
  @tracked validityOption?: string | null;
  @tracked validityStartDate?: string | null;
  @tracked validityEndDate?: string | null;
  @tracked _trafficMeasures?: Collection<TrafficMeasureConcept>;
  @tracked isLoadingModel?: boolean;

  get trafficMeasures() {
    return this._trafficMeasures ? this._trafficMeasures : this.model;
  }

  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.validation,
    );
  }

  get hasActiveFilter() {
    return Boolean(
      this.label ||
        this.templateValue ||
        this.validityOption ||
        this.validation,
    );
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
      await this.fetchData.perform();
    },
  );

  fetchData = restartableTask(async () => {
    this.isLoadingModel = true;
    const query: Record<string, unknown> = {
      sort: this.sort,
      filter: {},
    };
    const { uris: trafficMeasureConceptUris, count } = await fetchManualData(
      'traffic-measure-concept',
      {
        page: this.page,
        size: this.size,
        label: this.label,
        sort: this.sort,
        validation: this.validation,
        validityOption: this.validityOption,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
      },
    );
    query['filter'] = {
      id: trafficMeasureConceptUris.join(','),
    };
    const trafficMeasures = trafficMeasureConceptUris.length
      ? await this.store.query<TrafficMeasureConcept>(
          'traffic-measure-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as unknown as Awaited<
          ReturnType<typeof this.store.query<TrafficMeasureConcept>>
        >);
    trafficMeasures.meta = generateMeta(
      { page: this.page, size: this.size },
      count,
    );
    trafficMeasures.meta[count] = count;
    this._trafficMeasures = trafficMeasures;
    this.isLoadingModel = false;
  });

  @action
  updateValidationFilter(
    selectedOption: (typeof this.validationStatusOptions)[number],
  ) {
    if (selectedOption) {
      this.validation = selectedOption.value;
      this.resetPagination();
    } else {
      this.validation = null;
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

  resetPagination() {
    this.page = 0;
  }
  resetFilters = () => {
    this.label = '';
    this.templateValue = '';
    this.validation = null;
    this.validityOption = null;
    this.validityStartDate = null;
    this.validityEndDate = null;
    this.resetPagination();
  };
}
