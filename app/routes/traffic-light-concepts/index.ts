import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import type { Collection } from 'mow-registry/utils/type-utils';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  validation?: string;
  arPlichtig?: string;
  validityOption?: string;
  validityStartDate?: string;
  validityEndDate?: string;
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
    arPlichtig: { refreshModel: true },
    validityOption: { refreshModel: true },
    validityStartDate: { refreshModel: true },
    validityEndDate: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      sort: params.sort,
      filter: {},
    };
    const { uris: trafficLightUris, count } = await fetchManualData(
      'traffic-light-concept',
      params,
    );
    query['filter'] = {
      id: trafficLightUris.join(','),
    };
    const trafficLights = trafficLightUris.length
      ? await this.store.query<TrafficLightConcept>(
          'traffic-light-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as Collection<TrafficLightConcept>);
    trafficLights.meta = generateMeta(params, count);
    trafficLights.meta.count = count;
    return hash({
      trafficLightConcepts: trafficLights,
    });
  }
}
