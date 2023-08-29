import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadmarkingConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      newRoadMarkingConcept: this.store.createRecord('road-marking-concept'),
    });
  }
}
