import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

interface Params {
  id: string;
}

export default class TrafficLightConceptsTrafficlightConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const mainConcept = await this.store.findRecord<'traffic-light-concept'>(
      'traffic-light-concept',
      params.id
    );

    mainConcept.relatedTrafficLightConcepts = [];
    mainConcept.relatedTrafficLightConcepts
      .addObjects(await mainConcept.relatedToTrafficLightConcepts)
      .addObjects(await mainConcept.relatedFromTrafficLightConcepts);
    return { mainConcept };
  }
}
