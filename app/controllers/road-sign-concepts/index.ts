import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsIndexRoute from 'mow-registry/routes/road-sign-concepts/index';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'code', 'meaning', 'sort', 'category'];

  declare model: ModelFrom<RoadsignConceptsIndexRoute>;

  @tracked page = 0;
  @tracked size = 30;
  @tracked code = '';
  @tracked meaning = '';
  @tracked category?: string | null;
  @tracked sort = 'road-sign-concept-code';

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'category' | 'meaning', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  get selectedCategory() {
    if (!this.category) {
      return null;
    }
    return this.model.categories.find((category) => {
      return category.id === this.category;
    });
  }

  @action
  updateCategoryFilter(selectedCategory: RoadSignCategoryModel) {
    if (selectedCategory) {
      this.category = selectedCategory.id;
      this.resetPagination();
    } else {
      this.category = null;
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
