import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class RoadmarkingConceptsRoute extends Route {
  @service() session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'mock-login');
  }
}