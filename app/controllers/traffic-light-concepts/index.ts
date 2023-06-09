import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficlightConceptsIndexRoute from 'mow-registry/routes/traffic-light-concepts/index';

export default class RoadsignConceptsIndexController extends Controller {
  queryParams = ['page', 'size', 'code', 'meaning', 'sort', 'category'];
  declare model: ModelFrom<TrafficlightConceptsIndexRoute>;
  @tracked page = 0;
  @tracked size = 30;
  @tracked code = '';
  @tracked meaning = '';
  @tracked category: string | null = null;
  @tracked sort = 'traffic-light-concept-code';

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'meaning' | 'code', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (
        event.target as HTMLInputElement
      ).value.trim();
      this.resetPagination();
    }
  );

  get selectedCategory() {
    if (!this.category) {
      return null;
    }
    //@ts-expect-error categories is not defined on model
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return this.model.categories.find((category) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return category.id === this.category;
    });
  }

  @action
  //@ts-expect-error this.category is not defined
  updateCategoryFilter(selectedCategory) {
    if (selectedCategory) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
