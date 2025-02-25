import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { isSome } from 'mow-registry/utils/option';
import { hash } from 'rsvp';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  validation?: string;
};
export default class TrafficlightConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    meaning: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    validation: { refreshModel: true },
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

    if (isSome(params.validation)) {
      if (params.validation === 'true') {
        query['filter[valid]'] = true;
      } else {
        query['filter[:or:][:has-no:valid]'] = 'yes';
        query['filter[:or:][valid]'] = false;
      }
    }
    return hash({
      trafficLightConcepts: this.store.query<TrafficLightConcept>(
        'traffic-light-concept',
        // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
        // TODO: fix the query types
        query,
      ),
    });
  }
}
