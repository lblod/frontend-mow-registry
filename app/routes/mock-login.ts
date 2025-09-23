import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Account from 'mow-registry/models/account';
import SessionService from 'mow-registry/services/session';
import { query } from '@warp-drive/legacy/compat/builders';
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
    const accounts = await this.store
      .request(
        query<Account>('account', {
          include: ['user.groups'],
          'filter[provider]': 'https://github.com/lblod/mock-login-service',
          'page[size]': 10,
          'page[number]': params.page,
        }),
      )
      .then((res) => res.content);
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
