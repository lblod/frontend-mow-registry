import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsIndexRoute extends Route {
  @service store;

  queryParams = {
    code: { refreshModel: true },
    meaning: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    category: { refreshModel: true },
  };

  async model(params) {
    let query = {
      sort: params.sort,
      include: 'categories',
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.code) {
      query['filter[road-sign-concept-code]'] = params.code;
    }

    if (params.meaning) {
      query['filter[meaning]'] = params.meaning;
    }

    if (params.category) {
      query['filter[categories][:id:]'] = params.category;
    }

    return hash({
      roadSignConcepts: this.store.query('road-sign-concept', query),
      categories: this.store.findAll('road-sign-category', { reload: true }),
    });
  }
}
