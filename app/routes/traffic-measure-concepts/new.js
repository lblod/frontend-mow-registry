import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const TRAFFIC_MEASURE_RESOURCE_UUID = 'f51431b5-87f4-4c15-bb23-2ebaa8d65446';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service store;

  async model() {
    const template = this.store.createRecord('template');
    const concept = this.store.createRecord('concept');
    const nodeShape = this.store.createRecord('node-shape');

    template.value = '';
    concept.template = template;

    const trafficMeasureResource = await this.store.findRecord(
      'resource',
      TRAFFIC_MEASURE_RESOURCE_UUID
    );

    nodeShape.targetClass = trafficMeasureResource;
    nodeShape.targetHasConcept = concept;

    // await template.save();
    // await concept.save();
    // await nodeShape.save();

    return nodeShape;
  }
}
