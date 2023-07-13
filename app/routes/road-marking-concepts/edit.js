import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadmarkingConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      roadMarkingConcept: this.store.findRecord(
        'road-marking-concept',
        params.id,
      ),
    });
  }
  resetController(controller) {
    controller.reset();
  }
}
