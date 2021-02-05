import Route from '@ember/routing/route';

export default class MeasureConcept extends Route {
  model(params) {
    let measureconceptId = params.id;
    return this.store.findRecord('measureconcept', measureconceptId);
  }
}
