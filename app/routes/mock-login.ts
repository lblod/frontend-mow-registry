import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Account from 'mow-registry/models/account';
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
  async model(params: Params) {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    const accounts = await this.store.query<Account>('account', {
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      include: 'user.groups',
      filter: filter,
      page: { size: 10, number: params.page },
    });
    const promises = accounts.map(async (account) => {
      const user = await account.user;

      const group = (await user?.groups)?.slice()[0];
      return {
        account,
        user,
        group,
      };
    });

    return Promise.all(promises);
  }
}
