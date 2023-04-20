import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';

const PARENT_ROUTE = 'road-sign-concepts.road-sign-concept';

interface Params {
  instruction_id: string;
}

export default class RoadSignConceptsRoadSignConceptInstructionRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { mainConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadSignConceptsRoadSignConceptRoute>;

    if (params.instruction_id === 'new') {
      return {
        mainConcept,
        from: PARENT_ROUTE,
      };
    } else {
      const template = await this.store.findRecord(
        'template',
        params.instruction_id,
        {
          include: 'mappings',
        }
      );
      return {
        template,
        mainConcept,
        from: PARENT_ROUTE,
      };
    }
  }
}
