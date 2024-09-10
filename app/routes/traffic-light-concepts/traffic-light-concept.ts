import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TrafficLightConceptsTrafficLightConceptController from 'mow-registry/controllers/traffic-light-concepts/traffic-light-concept';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';

type Params = {
  id: string;
};

export default class TrafficlightConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      trafficLightConcept: this.store.findRecord<TrafficLightConceptModel>(
        'traffic-light-concept',
        params.id,
      ),
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

  resetController(
    controller: TrafficLightConceptsTrafficLightConceptController,
  ) {
    controller.reset();
  }
}
