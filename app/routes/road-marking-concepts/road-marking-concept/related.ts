import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import Controller from 'mow-registry/controllers/road-marking-concepts/road-marking-concept/related';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
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
        .countAndFetchAll<RoadMarkingConcept>('road-marking-concept', {
          include: ['image.file'],
          page: {
            size: 10000,
          },
        })
        .then((res) => res.content)
        .then((allRoadMarkings: RoadMarkingConcept[]) => {
          return allRoadMarkings.filter(
            (roadMarking) => roadMarking.id !== roadMarkingConcept.id,
          );
        }),
      allTrafficLights: this.store
        .countAndFetchAll<TrafficLightConcept>('traffic-light-concept', {
          include: ['image.file'],
          page: {
            size: 10000,
          },
        })
        .then((res) => res.content),
      allRoadSigns: this.store
        .countAndFetchAll<RoadSignConcept>('road-sign-concept', {
          'filter[classifications][:not:label]': 'Onderbord',
          include: ['image.file'],
          page: {
            size: 10000,
          },
        })
        .then((res) => res.content),
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
