import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConcept extends Route {
  @service store;

  model(params) {
    return hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      allSubSigns: this.store.query('road-sign-concept', {
        filter: {
          categories: {
            label: 'Onderbord',
          },
        },
      }),
      categories: this.store.findAll('road-sign-category').then((category) => {
        return category.filter(({ label }) => label !== 'Onderbord');
      }),
    });
  }
}
