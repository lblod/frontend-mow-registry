import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsIndexRoute extends Route {
  @service store;

  queryParams = {
    search: { refreshModel: true },
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

    if (params.search) {
      query.filter = params.search;
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
