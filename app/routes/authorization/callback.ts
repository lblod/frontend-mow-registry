import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import SessionService from 'mow-registry/services/session';

type Params = {
  code: string;
};
export default class AuthorizationCallbackRoute extends Route {
  @service declare session: SessionService;

  queryParams = {
    code: {
      refreshModel: true,
    },
  };

  beforeModel() {
    // redirect to index if already authenticated
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.prohibitAuthentication('index');
  }

  model(params: Params) {
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.authenticate('authenticator:acm-idm', params.code);
  }
}
