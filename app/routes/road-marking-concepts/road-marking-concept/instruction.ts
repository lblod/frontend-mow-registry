import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadmarkingConcept from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';
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
      const template = await this.store.findRecord(
        'template',
        params.instruction_id,
        {
          include: 'mappings',
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
