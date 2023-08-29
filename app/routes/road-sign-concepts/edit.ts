import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsEditController from 'mow-registry/controllers/road-sign-concepts/edit';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class RoadsignConceptsEditRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    return hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      categories: this.store.findAll('road-sign-category'),
    });
  }
  resetController(controller: RoadsignConceptsEditController) {
    controller.reset();
  }
}
