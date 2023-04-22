import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import RouterService from '@ember/routing/router-service';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service declare router: RouterService;

  @tracked isOpen = false;

  removeTrafficLightConcept = task(async (concept, event) => {
    event.preventDefault();
    await concept.destroyRecord();
    this.router.transitionTo('traffic-light-concepts');
  });
}
