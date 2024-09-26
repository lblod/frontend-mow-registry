// eslint-disable-next-line ember/use-ember-data-rfc-395-imports -- https://github.com/ember-cli/eslint-plugin-ember/issues/2156
import type Store from 'ember-data/store';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import type RoadsignConcept from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

type Params = {
  instructionId: string;
};

export default class RoadSignConceptsRoadSignConceptInstructionsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadsignConcept>;
    const concept = roadSignConcept;
    if (params.instructionId === 'new') {
      return {
        roadSignConcept,
        concept,
      };
    } else {
      const template = await this.store.findRecord<Template>(
        'template',
        params.instructionId,
        {
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          include: 'variables',
        },
      );
      return {
        template,
        roadSignConcept,
        concept,
      };
    }
  }
}
