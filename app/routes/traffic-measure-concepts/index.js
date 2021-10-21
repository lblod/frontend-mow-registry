import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const TRAFFIC_MEASURE_RESOURCE_UUID = 'f51431b5-87f4-4c15-bb23-2ebaa8d65446';

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
    };

    if (params.code) {
      query['filter[label]'] = params.code;
    }

    // We only want node shapes that are targetting a traffic measure
    query['filter[targetClass][:id:]'] = TRAFFIC_MEASURE_RESOURCE_UUID;

    return await this.store.query('node-shape', query);
  }
}
