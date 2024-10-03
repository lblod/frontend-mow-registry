import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class RoadMarkingConceptsRoadMarkingConceptIndexRoute extends Route {
  @service declare router: RouterService;

  beforeModel() {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instructions',
    );
  }
}
