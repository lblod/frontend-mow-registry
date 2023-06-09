import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import SessionService from 'mow-registry/services/session';

export default class ApplicationRoute extends Route {
  @service declare session: SessionService;

  beforeModel() {
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.session.setup();
  }
}
