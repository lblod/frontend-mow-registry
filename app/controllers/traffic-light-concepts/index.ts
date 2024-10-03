import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficlightConceptsIndexRoute from 'mow-registry/routes/traffic-light-concepts/index';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'meaning', 'sort', 'classification'];
  declare model: ModelFrom<TrafficlightConceptsIndexRoute>;
  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked classification: string | null = null;
  @tracked sort = ':no-case:label';

  get hasActiveFilter() {
    return Boolean(this.label || this.meaning);
  }

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'meaning' | 'label', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  get selectedClassification() {
    if (!this.classification) {
      return null;
    }
    //@ts-expect-error classifications is not defined on model
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return this.model.classifications.find((classification) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return classification.id === this.classification;
    });
  }

  @action
  //@ts-expect-error this.classification is not defined
  updateCategoryFilter(selectedClassification) {
    if (selectedClassification) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.classification = selectedClassification.id;
      this.resetPagination();
    } else {
      this.classification = null;
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
    this.resetPagination();
  };

  resetPagination() {
    this.page = 0;
  }
}
