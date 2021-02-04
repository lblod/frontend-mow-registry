import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service store;

  model() {
    return hash({
      newRoadSignConcept: this.store.createRecord('roadsignconcept'),
      categories: this.store.findAll('roadsigncategory'),
    });
  }
}
