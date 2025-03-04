import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';

type Params = {
  label?: string;
  page: number;
  size: number;
  sort: string;
  templateValue: string;
  validityOption?: string;
  validityStartDate?: string;
  validityEndDate?: string;
};
export default class TrafficMeasureConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    template: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    templateValue: { refreshModel: true },
    validityOption: { refreshModel: true },
    validityStartDate: { refreshModel: true },
    validityEndDate: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      sort: params.sort,
      include: 'template',
      filter: {},
    };
    const { uris: trafficMeasureUris, count } = await fetchManualData(
      'traffic-measure-concept',
      params,
    );
    query.filter = {
      id: trafficMeasureUris.join(','),
    };
    const trafficMeasures = trafficMeasureUris.length
      ? await this.store.query<TrafficMeasureConcept>(
          'traffic-measure-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : [];
    trafficMeasures.meta = generateMeta(params, count);
    trafficMeasures.meta.count = count;

    return trafficMeasures;
  }
}
