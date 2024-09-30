import Route from '@ember/routing/route';
import { service } from '@ember/service';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports -- https://github.com/ember-cli/eslint-plugin-ember/issues/2156
import type Store from 'ember-data/store';
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
            // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
            // TODO: fix the query types
            include: 'variables',
          },
        ),
        trafficLightConcept,
      };
    }
  }
}
