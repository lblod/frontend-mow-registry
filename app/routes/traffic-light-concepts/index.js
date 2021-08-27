import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficlightConceptsIndexRoute extends Route {
  @service store;

  queryParams = {
    code: { refreshModel: true },
    meaning: { refreshModel: true },
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
      query['filter[traffic-light-concept-code]'] = params.code;
    }

    if (params.meaning) {
      query['filter[meaning]'] = params.meaning;
    }

    return hash({
      trafficLightConcepts: this.store.query('traffic-light-concept', query),
    });
  }
}
