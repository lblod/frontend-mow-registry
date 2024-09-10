import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadmarkingConceptsRoadmarkingConceptController from 'mow-registry/controllers/road-marking-concepts/road-marking-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';

type Params = {
  id: string;
};

export default class RoadmarkingConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      roadMarkingConcept: this.store.findRecord<RoadMarkingConcept>(
        'road-marking-concept',
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

  resetController(controller: RoadmarkingConceptsRoadmarkingConceptController) {
    controller.reset();
  }
}
