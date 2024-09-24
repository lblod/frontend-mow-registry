import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import RoadmarkingConcept from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
const PARENT_ROUTE = 'road-marking-concepts.road-marking-concept';

type Params = {
  instruction_id: string;
};

export default class RoadMarkingConceptsRoadMarkingConceptInstructionRoute extends Route {
  @service declare store: Store;
  async model(params: Params) {
    const parentModel = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadmarkingConcept>;
    const concept = parentModel.roadMarkingConcept;
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
