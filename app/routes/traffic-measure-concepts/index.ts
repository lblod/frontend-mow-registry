import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import type { Collection } from 'mow-registry/utils/type-utils';
import { action } from '@ember/object';
import type Transition from '@ember/routing/transition';

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
    query['filter'] = {
      id: trafficMeasureUris.join(','),
    };
    const trafficMeasures = trafficMeasureUris.length
      ? await this.store.query<TrafficMeasureConcept>(
          'traffic-measure-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as Collection<TrafficMeasureConcept>);
    trafficMeasures.meta = generateMeta(params, count);
    trafficMeasures.meta.count = count;

    return trafficMeasures;
  }
  @action
  loading(transition: Transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise?.finally(function () {
      controller.set('isLoadingModel', false);
    });
    return true; // bubble the loading event
  }
}
