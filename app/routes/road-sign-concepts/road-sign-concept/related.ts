import Route from '@ember/routing/route';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports -- https://github.com/ember-cli/eslint-plugin-ember/issues/2156
import type Store from 'ember-data/store';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';
import { service } from '@ember/service';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RelatedController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept/related';
import type Transition from '@ember/routing/transition';

export default class RoadSignConceptsRoadSignConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;

    return hash({
      roadSignConcept,
      allRoadMarkings: this.store.query<RoadMarkingConcept>(
        'road-marking-concept',
        {
          page: {
            size: 10000,
          },
        },
      ),
      allTrafficLights: this.store.query<TrafficLightConcept>(
        'traffic-light-concept',
        {
          page: {
            size: 10000,
          },
        },
      ),
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
