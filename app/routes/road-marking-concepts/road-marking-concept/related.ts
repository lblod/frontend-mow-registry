import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from 'ember-data/store';
import Controller from 'mow-registry/controllers/road-marking-concepts/road-marking-concept/related';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type RoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadMarkingConceptRoute>;

    const model = await hash({
      roadMarkingConcept,
      allRoadMarkings: this.store
        .query<RoadMarkingConcept>('road-marking-concept', {
          page: {
            size: 10000,
          },
        })
        .then((allRoadMarkings) => {
          return allRoadMarkings.filter(
            (roadMarking) => roadMarking.id !== roadMarkingConcept.id,
          );
        }),
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

    model.roadMarkingConcept.relatedRoadMarkingConcepts = new TrackedArray([
      ...(await model.roadMarkingConcept.relatedToRoadMarkingConcepts),
      ...(await model.roadMarkingConcept.relatedFromRoadMarkingConcepts),
    ]);

    return model;
  }

  resetController(controller: Controller) {
    controller.reset();
  }
}
