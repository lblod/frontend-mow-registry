import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TrafficlightConcept from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';
const PARENT_ROUTE = 'traffic-light-concepts.traffic-light-concept.index';

type Params = {
  instruction_id: string;
};

export default class TrafficLightConceptsTrafficLightConceptInstructionRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    const parentModel = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficlightConcept>;
    const concept = parentModel.trafficLightConcept;
    if (params.instruction_id === 'new') {
      return {
        concept,
        from: PARENT_ROUTE,
      };
    } else {
      return {
        template: this.store.findRecord('template', params.instruction_id, {
          include: 'variables',
        }),
        concept,
        from: PARENT_ROUTE,
      };
    }
  }
}
