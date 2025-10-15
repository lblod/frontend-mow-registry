import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';

export default class RoadmarkingConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return {
      newRoadMarkingConcept: this.store.createRecord<RoadMarkingConcept>(
        'road-marking-concept',
        {},
      ),
    };
  }
}
