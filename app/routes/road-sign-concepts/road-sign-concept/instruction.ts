import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
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
      const template = await this.store.findRecord(
        'template',
        params.instruction_id,
        {
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
