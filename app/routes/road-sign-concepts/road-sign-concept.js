import Route from '@ember/routing/route';

export default class RoadsignConcept extends Route {
  model(params) {
    let roadSignConceptId = params.id;
    return this.store.findRecord('road-sign-concept', roadSignConceptId);
  }
}
