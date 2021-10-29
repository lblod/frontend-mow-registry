import Route from '@ember/routing/route';

export default class TrafficMeasureConceptsEditRoute extends Route {
  async model(params) {
    const trafficMeasureConcept = this.store.findRecord(
      'traffic-measure-concept',
      params.id
    );
    return trafficMeasureConcept;
  }
}
