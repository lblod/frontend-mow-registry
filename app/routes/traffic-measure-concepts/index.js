import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrafficMeasureConceptsIndexRoute extends Route {
  @service store;

  queryParams = {
    code: { refreshModel: true },
    template: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params) {
    let query = {
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
