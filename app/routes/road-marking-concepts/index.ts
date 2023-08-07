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
};

export default class RoadmarkingConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    code: { refreshModel: true },
    meaning: { refreshModel: true },
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

    if (params.code) {
      query['filter[road-marking-concept-code]'] = params.code;
    }

    if (params.meaning) {
      query['filter[meaning]'] = params.meaning;
    }

    return hash({
      roadMarkingConcepts: await this.store.query(
        'road-marking-concept',
        query,
      ),
    });
  }
}
