import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CodelistsService extends Service {
  constructor(...args) {
    super(...args);
  }

  @tracked codeLists = null;

  @service store;

  @task
  *all() {
    if (!this.codeLists) {
      const codeLists = yield this.store.query('code-list', {
        'page[size]': 100,
        include: 'codeListOptions',
        sort: 'label',
      });

      for (let i = 0; i < codeLists.length; i++) {
        const codeList = codeLists.objectAt(i);
        yield codeList.codeListOptions;
      }

      this.codeLists = codeLists;
    }
    return this.codeLists;
  }
}
