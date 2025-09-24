import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficLightConceptRelatedController from 'mow-registry/controllers/traffic-light-concepts/traffic-light-concept/related';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';
import { query } from '@warp-drive/legacy/compat/builders';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';

export default class TrafficLightConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficLightConceptRoute>;

    const model = await hash({
      trafficLightConcept,
      allRoadMarkings: this.store
        .request(
          query<RoadMarkingConcept>('road-marking-concept', {
            include: ['image.file'],
            page: {
              size: 10000,
            },
          }),
        )
        .then((response) => response.content),
      allTrafficLights: this.store
        .request(
          query<TrafficLightConceptModel>('traffic-light-concept', {
            include: ['image.file'],
            page: {
              size: 10000,
            },
          }),
        )
        .then((response) => response.content),
      allRoadSigns: this.store
        .request(
          query<RoadSignConcept>('road-sign-concept', {
            include: ['image.file'],
            'filter[classifications][:not:label]': 'Onderbord',
            page: {
              size: 10000,
            },
          }),
        )
        .then((response) => response.content),
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
