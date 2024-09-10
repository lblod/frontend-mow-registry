import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Icon from 'mow-registry/models/icon';

type Params = {
  label?: string;
  page: number;
  size: number;
  sort: string;
};
export default class IconCatalogIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
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

    if (params.label) {
      query['filter[label]'] = params.label;
    }

    return {
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      icons: await this.store.query<Icon>('icon', query),
    };
  }
}
