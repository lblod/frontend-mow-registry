import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import SessionService from 'mow-registry/services/session';

type Params = {
  page: number;
};
export default class MockLoginRoute extends Route {
  @service declare session: SessionService;
  @service declare store: Store;

  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  beforeModel() {
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.prohibitAuthentication('index');
  }

  model(params: Params) {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    return this.store.query('account', {
      include: 'user.groups',
      filter: filter,
      page: { size: 10, number: params.page },
    });
  }
}
