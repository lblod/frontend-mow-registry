import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  category?: string;
};

export default class RoadsignConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    meaning: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    category: { refreshModel: true },
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

    if (params.meaning) {
      query['filter[meaning]'] = params.meaning;
    }

    if (params.category) {
      query['filter[classifications][:id:]'] = params.category;
    }

    return hash({
      roadSignConcepts: this.store.query('road-sign-concept', query),
      classifications: this.store.findAll('road-sign-category', {
        reload: true,
      }),
    });
  }
}
