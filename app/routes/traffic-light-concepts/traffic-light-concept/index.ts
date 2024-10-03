import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class TrafficLightConceptsTrafficLightConceptIndexRoute extends Route {
  @service declare router: RouterService;

  beforeModel() {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instructions',
    );
  }
}
