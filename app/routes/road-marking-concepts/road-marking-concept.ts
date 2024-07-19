import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadmarkingConceptsRoadmarkingConceptController from 'mow-registry/controllers/road-marking-concepts/road-marking-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};

export default class RoadmarkingConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      roadMarkingConcept: this.store.findRecord(
        'road-marking-concept',
        params.id,
      ),
      allRoadMarkings: this.store.query('road-marking-concept', {
        page: {
          size: 10000,
        },
      }),
      allTrafficLights: this.store.query('traffic-light-concept', {
        page: {
          size: 10000,
        },
      }),
      classifications: this.store
        .findAll('road-sign-category')
        .then((classification) => {
          return classification.filter(({ label }) => label !== 'Onderbord');
        }),
    });

    model.roadMarkingConcept.relatedRoadMarkingConcepts = [];
    model.roadMarkingConcept.relatedRoadMarkingConcepts
      .addObjects(await model.roadMarkingConcept.relatedToRoadMarkingConcepts)
      .addObjects(
        await model.roadMarkingConcept.relatedFromRoadMarkingConcepts,
      );

    return model;
  }

  resetController(controller: RoadmarkingConceptsRoadmarkingConceptController) {
    controller.reset();
  }
}
