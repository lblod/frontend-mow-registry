import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      roadSignConcept: this.store.findRecord('roadsignconcept', params.id),
      categories: this.store.findAll('roadsigncategory'),
    });
  }
}
