import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service store;

  model() {
    return hash({
      newRoadSignConcept: this.store.createRecord('road-sign-concept'),
      categories: this.store.findAll('road-sign-category'),
    });
  }
  resetController(controller) {
    const roadSignConcept = controller.model.newRoadSignConcept;
    roadSignConcept.rollbackAttributes();
  }
}
