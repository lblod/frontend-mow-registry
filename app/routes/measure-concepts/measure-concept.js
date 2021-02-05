import Route from '@ember/routing/route';

export default class MeasureConcept extends Route {
  model(params) {
    let measureConceptId = params.id;
    return this.store.findRecord('measure-concept', measureConceptId);
  }
}
