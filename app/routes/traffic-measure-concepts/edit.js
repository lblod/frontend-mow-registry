import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrafficMeasureConceptsEditRoute extends Route {
  @service store;
  async model(params) {
    const trafficMeasureConcept = this.store.findRecord(
      'traffic-measure-concept',
      params.id
    );
    return trafficMeasureConcept;
  }
}
