import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import TrafficlightConcept from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
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
        template: this.store.findRecord<Template>(
          'template',
          params.instruction_id,
          {
            // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
            // TODO: fix the query types
            include: 'variables',
          },
        ),
        concept,
        from: PARENT_ROUTE,
      };
    }
  }
}
