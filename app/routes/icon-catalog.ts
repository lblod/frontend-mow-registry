import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import SessionService from 'mow-registry/services/session';

export default class IconCatalogRoute extends Route {
  @service declare session: SessionService;

  beforeModel(transition: Transition) {
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.requireAuthentication(transition, 'login');
  }
}
