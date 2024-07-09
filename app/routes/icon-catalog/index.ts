import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

type Params = {
  page: number;
  size: number;
  sort: string;
};
export default class IconCatalogIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    return hash({
      icons: this.store.query('icon', query),
    });
  }
}
