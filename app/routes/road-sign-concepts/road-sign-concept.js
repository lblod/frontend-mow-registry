import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConcept extends Route {
  @service store;

  model(params) {
    return hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      allSubSigns: this.store
        .query('road-sign-category', {
          filter: { label: 'Onderbord' },
          include: 'roadSignConcepts',
        })
        .then(function (subSigns) {
          return subSigns.firstObject;
        }),
      categories: this.store
        .findAll('road-sign-category', {
          include: 'roadSignConcepts',
        })
        .then((category) => {
          return category.filter(({ label }) => label !== 'Onderbord');
        }),
    });
  }
}
