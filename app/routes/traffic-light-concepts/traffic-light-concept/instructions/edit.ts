import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type Template from 'mow-registry/models/template';
import type TrafficlightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

type Params = {
  instructionId: string;
};

export default class TrafficLightConceptsTrafficLightConceptInstructionsEditRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficlightConceptRoute>;

    if (params.instructionId === 'new') {
      return {
        trafficLightConcept,
      };
    } else {
      return {
        template: this.store.findRecord<Template>(
          'template',
          params.instructionId,
          {
            include: ['variables'],
          },
        ),
        trafficLightConcept,
      };
    }
  }
}
