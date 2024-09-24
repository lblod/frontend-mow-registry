import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import SessionService from 'mow-registry/services/session';

export default class TrafficMeasureConceptsRoute extends Route {
  @service declare session: SessionService;

  beforeModel(transition: Transition) {
    //@ts-expect-error type definitions not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.requireAuthentication(transition, 'login');
  }
}
