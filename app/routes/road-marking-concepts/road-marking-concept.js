import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadmarkingConcept extends Route {
  @service store;

  async model(params) {
    let model = await hash({
      roadMarkingConcept: this.store.findRecord(
        'road-marking-concept',
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

    return model;
  }

  resetController(controller) {
    controller.reset();
  }
}
