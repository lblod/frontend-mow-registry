import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadMarkingConcept from '../road-marking-concept';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';

export default class RoadMarkingConceptsroadMarkingConceptMainSignsRoute extends Route {
  @service declare store: Store;

  model() {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadMarkingConcept>;
    return { roadMarkingConcept };
  }
}
