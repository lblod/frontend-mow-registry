import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsIndexRoute from 'mow-registry/routes/road-sign-concepts/index';
import RoadSignCategory from 'mow-registry/models/road-sign-category';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'meaning', 'sort', 'classifications'];

  declare model: ModelFrom<RoadsignConceptsIndexRoute>;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked meaning = '';
  @tracked classification?: string | null;
  @tracked sort = 'label';

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
      return classification.id === this.classification;
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

  @action onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action onSortChange(newSort: string) {
    this.sort = newSort;
  }

  resetPagination() {
    this.page = 0;
  }
}
