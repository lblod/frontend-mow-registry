import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
const PARENT_ROUTE = 'traffic-light-concepts.traffic-light-concept.index';

export default class TrafficLightConceptsTrafficLightConceptInstructionRoute extends Route {
  @service store;
  model(params) {
    const concept = this.modelFor(
      'traffic-light-concepts.traffic-light-concept'
    ).trafficLightConcept;
    if (params.instruction_id === 'new') {
      return {
        concept,
        from: PARENT_ROUTE,
      };
    } else {
      return {
        template: this.store.findRecord('template', params.instruction_id, {
          include: 'mappings',
        }),
        concept,
        from: PARENT_ROUTE,
      };
    }
  }
}
