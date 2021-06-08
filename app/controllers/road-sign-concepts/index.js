import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'search', 'sort', 'category'];

  @tracked page = 0;
  @tracked size = 30;
  @tracked search = '';
  @tracked category = null;
  @tracked sort = 'road-sign-concept-code';

  @restartableTask
  *updateSearchFilterTask(event) {
    yield timeout(300);

    this.search = event.target.value;
    this.resetPagination();
  }

  get selectedCategory() {
    if (!this.category) {
      return null;
    }

    return this.model.categories.find((category) => {
      return category.id === this.category;
    });
  }

  @action
  updateCategoryFilter(selectedCategory) {
    if (selectedCategory) {
      this.category = selectedCategory.id;
      this.resetPagination();
    } else {
      this.category = null;
    }
  }

  resetPagination() {
    this.page = 0;
  }
}
