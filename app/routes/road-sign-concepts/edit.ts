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

  async model(params: Params) {
    const shapeConcepts = await this.store.findAll(
      'tribont-shape-classificatie-code',
    );
    const quantityKinds = await this.store.query('quantity-kind', {
      include: 'units',
    });
    const units = await this.store.findAll('unit');

    return hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      classifications: this.store.findAll('road-sign-category'),
      shapeConcepts,
      quantityKinds,
      units,
    });
  }
  resetController(controller: RoadsignConceptsEditController) {
    controller.reset();
  }
}
