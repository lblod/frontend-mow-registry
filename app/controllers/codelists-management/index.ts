import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import Store from 'mow-registry/services/store';
import type CodeList from 'mow-registry/models/code-list';
import type { LegacyResourceQuery } from '@warp-drive/core/types';
import { query } from '@warp-drive/legacy/compat/builders';

export default class CodelistsManagementIndexController extends Controller {
  queryParams = ['page', 'size', 'label', 'sort'];

  @tracked page = 0;
  @tracked size = 30;
  @tracked label = '';
  @tracked sort = ':no-case:label';
  @service
  declare store: Store;

  updateSearchFilterTask = restartableTask(
    async (queryParamProperty: 'label', event: InputEvent) => {
      await timeout(300);

      this[queryParamProperty] = (event.target as HTMLInputElement).value;
      this.resetPagination();
    },
  );

  @action onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action onSortChange(newSort: string) {
    this.sort = newSort;
  }

  resetPagination() {
    this.page = 0;
  }

  codelists = trackedFunction(this, async () => {
    const queryParams: LegacyResourceQuery<CodeList> = {
      include: ['type'],
      sort: this.sort,
      page: {
        number: this.page,
        size: this.size,
      },
    };

    if (this.label) {
      queryParams['filter'] = {
        label: this.label,
      };
    }
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();

    return (await this.store.request(query<CodeList>('code-list', queryParams)))
      .content;
  });
}
