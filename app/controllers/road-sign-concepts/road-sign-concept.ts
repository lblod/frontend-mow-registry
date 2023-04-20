import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class RoadSignConceptsRoadSignConceptController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptRoute>;
  @service declare router: RouterService;

  @tracked isOpen = false;

  removeRoadSignConcept = task(async (roadSignConcept, event) => {
    event.preventDefault();
    await roadSignConcept.destroyRecord();
    this.router.transitionTo('road-sign-concepts');
  });
}
