import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

type Params = {
  code?: string;
  page: number;
  size: number;
  sort: string;
};
export default class TrafficMeasureConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    code: { refreshModel: true },
    template: { refreshModel: true },
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
      include: 'templates',
    };

    if (params.code) {
      query['filter[label]'] = params.code;
    }

    const result = await this.store.query('traffic-measure-concept', query);

    return result;
  }
}
