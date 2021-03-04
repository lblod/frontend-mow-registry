import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class RoadsignConcept extends Route {
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
    });
  }
}
