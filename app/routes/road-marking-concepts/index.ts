import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { hash } from 'rsvp';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
};

export default class RoadmarkingConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
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

    if (params.label) {
      query['filter[label]'] = params.label;
    }

    if (params.meaning) {
      query['filter[meaning]'] = params.meaning;
    }

    return hash({
      roadMarkingConcepts: await this.store.query<RoadMarkingConcept>(
        'road-marking-concept',
        // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
        // TODO: fix the query types
        query,
      ),
    });
  }
}
