import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

type Params = {
  code?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  category?: string;
};

export default class RoadsignConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    code: { refreshModel: true },
    meaning: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    category: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      sort: params.sort,
      include: 'classifications',
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.code) {
      query['filter[code]'] = params.code;
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
