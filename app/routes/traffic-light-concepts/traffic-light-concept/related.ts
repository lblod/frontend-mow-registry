import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficLightConceptRelatedController from 'mow-registry/controllers/traffic-light-concepts/traffic-light-concept/related';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type TrafficLightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';

export default class TrafficLightConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficLightConceptRoute>;

    const model = await hash({
      trafficLightConcept,
      allRoadMarkings: this.store.query<RoadMarkingConcept>(
        'road-marking-concept',
        {
          page: {
            size: 10000,
          },
        },
      ),
      allTrafficLights: this.store.query<TrafficLightConceptModel>(
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

    model.trafficLightConcept.relatedTrafficLightConcepts = new TrackedArray([
      ...(await model.trafficLightConcept.relatedToTrafficLightConcepts),
      ...(await model.trafficLightConcept.relatedFromTrafficLightConcepts),
    ]);

    return model;
  }

  resetController(controller: TrafficLightConceptRelatedController) {
    controller.reset();
  }
}
