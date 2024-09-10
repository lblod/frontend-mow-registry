import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import RoadsignConcept from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';
const PARENT_ROUTE = 'road-sign-concepts.road-sign-concept';

type Params = {
  instruction_id: string;
};

export default class RoadSignConceptsRoadSignConceptInstructionRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const parentModel = this.modelFor(
      PARENT_ROUTE,
    ) as ModelFrom<RoadsignConcept>;
    const concept = parentModel.roadSignConcept;
    if (params.instruction_id === 'new') {
      return {
        concept,
        from: PARENT_ROUTE,
      };
    } else {
      const template = await this.store.findRecord<Template>(
        'template',
        params.instruction_id,
        {
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          include: 'variables',
        },
      );
      return {
        template,
        concept,
        from: PARENT_ROUTE,
      };
    }
  }
}
