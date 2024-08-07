import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import IconCatalogIndexRoute from 'mow-registry/routes/icon-catalog/index';

export default class IconCatalogIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'sort'];

  declare model: ModelFrom<IconCatalogIndexRoute>;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked sort = 'label';

  updateSearchFilterTask = restartableTask(async (event: InputEvent) => {
    await timeout(300);

    this.label = (event.target as HTMLInputElement).value.trimStart();
    this.resetPagination();
  });

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
