import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

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
    const icons = await this.store.query('icon', query);

    const sortedIcons = icons.toArray().sort((a, b) => {
      const labelA = (a.label || '').toLowerCase();
      const labelB = (b.label || '').toLowerCase();

      if (labelA < labelB) return -1;
      if (labelA > labelB) return 1;
      return 0;
    });

    return {
      icons: sortedIcons,
    };
  }
}
