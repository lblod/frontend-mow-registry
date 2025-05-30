import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import type Transition from '@ember/routing/transition';

type Params = {
  sort: string;
  page: number;
  size: number;
  label: string;
};

export default class CodelistsManagementIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      include: 'type',
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.label) {
      query['filter[label]'] = params.label;
    }

    return hash({
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      codelists: this.store.query<CodeList>('code-list', query),
    });
  }
  @action
  loading(transition: Transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise?.finally(function () {
      controller.set('isLoadingModel', false);
    });
    return true; // bubble the loading event
  }
}
