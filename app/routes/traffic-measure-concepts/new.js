import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

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
