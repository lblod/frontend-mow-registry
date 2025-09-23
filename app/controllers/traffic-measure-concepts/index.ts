import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Template from 'mow-registry/models/template';
import type IntlService from 'ember-intl/services/intl';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import Store from 'mow-registry/services/store';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import { trackedFunction } from 'reactiveweb/function';
import type { LegacyResourceQuery } from '@warp-drive/core/types';

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
  @tracked variableSignage?: string | null;
  @tracked validityOption?: string | null;
  @tracked validityStartDate?: string | null;
  @tracked validityEndDate?: string | null;

  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }
  get variableSignageOptions() {
    return [
      { value: 'true', label: this.intl.t('variable-signage-selector.yes') },
      { value: 'false', label: this.intl.t('variable-signage-selector.no') },
    ];
  }

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.validation,
    );
  }

  get selectedVariableSignage() {
    return this.variableSignageOptions.find(
      (option) => option.value === this.variableSignage,
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
    },
  );

  trafficMeasures = trackedFunction(this, async () => {
    const query: LegacyResourceQuery<TrafficMeasureConcept> = {
      sort: this.sort,
      filter: {},
    };
    const { uris: trafficMeasureConceptUris, count } = await fetchManualData(
      'traffic-measure-concept',
      {
        page: this.page,
        size: this.size,
        label: this.label,
        templateValue: this.templateValue,
        sort: this.sort,
        validation: this.validation,
        validityOption: this.validityOption,
        validityStartDate: this.validityStartDate,
        validityEndDate: this.validityEndDate,
        variableSignage: this.variableSignage,
      },
    );
    query['filter'] = {
      id: trafficMeasureConceptUris.join(','),
    };
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const trafficMeasures = trafficMeasureConceptUris.length
      ? await this.store.query<TrafficMeasureConcept>(
          'traffic-measure-concept',
          query,
        )
      : ([] as TrafficMeasureConcept[] as Awaited<
          ReturnType<typeof this.store.query<TrafficMeasureConcept>>
        >);
    trafficMeasures.meta = generateMeta(
      { page: this.page, size: this.size },
      count,
    );
    trafficMeasures.meta[count] = count;
    return trafficMeasures;
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
  updateSignageFilter(
    selectedOption: (typeof this.variableSignageOptions)[number],
  ) {
    if (selectedOption) {
      this.variableSignage = selectedOption.value;
      this.resetPagination();
    } else {
      this.variableSignage = null;
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
    this.variableSignage = null;
    this.validityOption = null;
    this.validityStartDate = null;
    this.validityEndDate = null;
    this.resetPagination();
  };
}
