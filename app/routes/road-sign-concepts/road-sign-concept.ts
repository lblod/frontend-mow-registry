import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

interface Params {
  id: string;
}

export default class RoadSignConceptsRoadSignConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const mainConcept = await this.store.findRecord<'road-sign-concept'>(
      'road-sign-concept',
      params.id
    );
    return { mainConcept };
  }
}