import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { set } from '@ember/object';

export default class MockLoginController extends Controller {
  page = 0;
  size = 10;

  @task
  *queryStore() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    const accounts = yield this.store.query('account', {
      include: 'user,user.groups',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'user.familyName',
    });
    return accounts;
  }

  @task({
    maxConcurrency: 3,
    restartable: true,
  })
  *updateSearch() {
    yield timeout(500);
    set('page', 0);
    const model = yield this.queryStore.perform();
    console.log(model);
    set('model', model);
  }
}
