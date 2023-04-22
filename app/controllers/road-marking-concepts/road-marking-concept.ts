import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class RoadmarkingConceptsRoadmarkingConceptController extends Controller {
  @service declare router: RouterService;

  @tracked isOpen = false;

  removeRoadMarkingConcept = task(async (concept, event) => {
    event.preventDefault();
    await concept.destroyRecord();
    this.router.transitionTo('road-marking-concepts');
  });
}
