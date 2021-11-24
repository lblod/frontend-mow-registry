import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const TRAFFIC_MEASURE_RESOURCE_UUID = 'f51431b5-87f4-4c15-bb23-2ebaa8d65446';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service store;

  async model() {
    const template = this.store.createRecord('template');
    const trafficMeasureConcept = this.store.createRecord(
      'traffic-measure-concept'
    );

    template.value = '';
    trafficMeasureConcept.templates.pushObject(template);
    
    return trafficMeasureConcept;
  }
}
