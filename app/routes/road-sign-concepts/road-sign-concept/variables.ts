import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';

export default class RoadSignConceptsRoadSignConceptVariablesRoute extends Route {
  @service declare store: Store;

  model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;
    return { roadSignConcept };
  }
}
