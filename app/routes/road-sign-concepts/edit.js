import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      categories: this.store.findAll('road-sign-category'),
    });
  }

  resetController(controller) {
    const roadSignConcept = controller.model.roadSignConcept;
    roadSignConcept.rollbackAttributes();
    roadSignConcept.hasMany('categories').reload();
  }
}
