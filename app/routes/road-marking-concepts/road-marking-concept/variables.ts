import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadMarkingConcept from '../road-marking-concept';
import type Store from 'ember-data/store';
import { service } from '@ember/service';

export default class RoadMarkingConceptsRoadMarkingConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadMarkingConcept>;
    return { roadMarkingConcept };
  }
}
