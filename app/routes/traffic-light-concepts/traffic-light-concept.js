import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficlightConcept extends Route {
  @service store;

  async model(params) {
    let model = await hash({
      trafficLightConcept: this.store.findRecord(
        'traffic-light-concept',
        params.id
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
      roadSignCategories: this.store
        .findAll('road-sign-category')
        .then((category) => {
          return category.filter(({ label }) => label !== 'Onderbord');
        }),
    });

    model.trafficLightConcept.relatedTrafficLightConcepts=[];
    model.trafficLightConcept.relatedTrafficLightConcepts
      .addObjects(await model.trafficLightConcept.relatedToTrafficLightConcepts)
      .addObjects(await model.trafficLightConcept.relatedFromTrafficLightConcepts)

    return model;
  }

  resetController(controller) {
    controller.reset();
  }
}
