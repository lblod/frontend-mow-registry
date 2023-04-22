import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

interface Params {
  id: string;
}

export default class RoadSignConceptsRoadSignConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const mainConcept = await this.store.findRecord<'road-marking-concept'>(
      'road-marking-concept',
      params.id
    );

    mainConcept.relatedRoadMarkingConcepts = [];
    mainConcept.relatedRoadMarkingConcepts
      .addObjects(await mainConcept.relatedToRoadMarkingConcepts)
      .addObjects(await mainConcept.relatedFromRoadMarkingConcepts);

    return { mainConcept };
  }
}
