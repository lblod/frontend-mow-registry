import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { loadInstructions } from 'mow-registry/utils/load-related';

interface Params {
  instruction_id: string;
}

export default class RoadMarkingConceptsRoadMarkingConceptInstructionRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    return await loadInstructions(
      this.store,
      mainConcept,
      params.instruction_id
    );
  }

  resetController(controller: any) {
    controller.model.template?.rollbackAttributes();
    controller.model.mainConcept?.rollbackAttributes();
  }
}
