import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

interface Params {
  id: string;
}

export default class RoadMarkingConceptsRoadMarkingConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const mainConcept = await this.store.findRecord<'road-marking-concept'>(
      'road-marking-concept',
      params.id
    );

    return { mainConcept };
  }
}
