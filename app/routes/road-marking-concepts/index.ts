import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { hash } from 'rsvp';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';
import type { Collection } from 'mow-registry/utils/type-utils';
import { action } from '@ember/object';
import type Transition from '@ember/routing/transition';

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

export default class RoadmarkingConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: false },
    meaning: { refreshModel: false },
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
    const { uris: roadMarkingUris, count } = await fetchManualData(
      'road-marking-concept',
      params,
    );
    query['filter'] = {
      id: roadMarkingUris.join(','),
    };
    const roadMarkings = roadMarkingUris.length
      ? await this.store.query<RoadMarkingConcept>(
          'road-marking-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : ([] as unknown as Collection<RoadMarkingConcept>);
    roadMarkings.meta = generateMeta(params, count);
    roadMarkings.meta['count'] = count;

    return hash({
      roadMarkingConcepts: roadMarkings,
    });
  }
  @action
  loading(transition: Transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise?.finally(function () {
      controller.set('isLoadingModel', false);
      controller.set('_roadMarkings', undefined);
    });
    return true; // bubble the loading event
  }
}
