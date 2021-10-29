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
    const nodeShape = this.store.createRecord('node-shape');

    template.value = '';
    trafficMeasureConcept.templates.pushObject(template);

    const trafficMeasureResource = await this.store.findRecord(
      'resource',
      TRAFFIC_MEASURE_RESOURCE_UUID
    );

    nodeShape.targetClass = trafficMeasureResource;
    nodeShape.targetHasConcept = trafficMeasureConcept;

    await trafficMeasureConcept.save();
    await nodeShape.save();

    return trafficMeasureConcept;
  }
}
