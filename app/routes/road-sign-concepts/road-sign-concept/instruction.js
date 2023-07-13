import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
const PARENT_ROUTE = 'road-sign-concepts.road-sign-concept';

export default class RoadSignConceptsRoadSignConceptInstructionRoute extends Route {
  @service store;
  async model(params) {
    console.log(this.modelFor('road-sign-concepts.road-sign-concept'));
    const concept = await this.modelFor('road-sign-concepts.road-sign-concept')
      .roadSignConcept;
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
