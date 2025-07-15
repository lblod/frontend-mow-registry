import Route from '@ember/routing/route';
import Store from 'mow-registry/services/store';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';
import { service } from '@ember/service';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RelatedController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept/related';
import type Transition from '@ember/routing/transition';
import { query } from '@warp-drive/legacy/compat/builders';

export default class RoadSignConceptsRoadSignConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;

    return hash({
      roadSignConcept,
      allRoadMarkings: this.store
        .request(
          query<RoadMarkingConcept>('road-marking-concept', {
            page: {
              size: 10000,
            },
          }),
        )
        .then((res) => res.content),
      allTrafficLights: this.store
        .request(
          query<TrafficLightConcept>('traffic-light-concept', {
            page: {
              size: 10000,
            },
          }),
        )
        .then((res) => res.content),
      classifications: this.store
        .findAll<RoadSignCategory>('road-sign-category')
        .then((classification) => {
          return classification.filter(({ label }) => label !== 'Onderbord');
        }),
    });
  }

  resetController(
    controller: RelatedController,
    isExiting: boolean,
    transition: Transition,
  ) {
    super.resetController(controller, isExiting, transition);

    controller.reset();
  }
}
