import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import IconCatalogIndexRoute from 'mow-registry/routes/icon-catalog/index';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import Store from '@ember-data/store';
import type Icon from 'mow-registry/models/icon';
import type { LegacyResourceQuery } from '@ember-data/store/types';

export default class IconCatalogIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'sort'];

  declare model: ModelFrom<IconCatalogIndexRoute>;

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked sort = ':no-case:label';
  @service
  declare store: Store;

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
  icons = trackedFunction(this, async () => {
    const query: LegacyResourceQuery<Icon> = {
      // TODO: The types expect an array, but the adapter doesn't convert that to the expected json:api include format
      // More info: https://github.com/emberjs/data/pull/9507#issuecomment-2219588690
      include: ['image.file', 'inScheme'],
      sort: this.sort,
      page: {
        number: this.page,
        size: this.size,
      },
    };

    if (this.label) {
      query['filter'] = {
        label: this.label,
      };
    }
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();

    return await this.store.query<Icon>('icon', query);
  });
}
