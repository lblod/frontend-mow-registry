import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
const PARENT_ROUTE = 'road-marking-concepts.road-marking-concept';

export default class RoadMarkingConceptsRoadMarkingConceptInstructionRoute extends Route {
  @service store;
  async model(params) {
    const concept = await this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ).roadMarkingConcept;
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
