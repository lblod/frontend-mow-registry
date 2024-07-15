import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TrafficLightConceptsTrafficLightConceptController from 'mow-registry/controllers/traffic-light-concepts/traffic-light-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class TrafficlightConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      trafficLightConcept: this.store.findRecord(
        'traffic-light-concept',
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

    model.trafficLightConcept.relatedTrafficLightConcepts = [];
    model.trafficLightConcept.relatedTrafficLightConcepts
      .addObjects(await model.trafficLightConcept.relatedToTrafficLightConcepts)
      .addObjects(
        await model.trafficLightConcept.relatedFromTrafficLightConcepts,
      );

    return model;
  }

  resetController(
    controller: TrafficLightConceptsTrafficLightConceptController,
  ) {
    controller.reset();
  }
}
