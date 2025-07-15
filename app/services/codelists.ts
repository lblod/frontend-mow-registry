import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from 'mow-registry/services/store';
import CodeList from 'mow-registry/models/code-list';
import { query } from '@warp-drive/legacy/compat/builders';

export default class CodelistsService extends Service {
  @tracked codeLists?: CodeList[];

  @service declare store: Store;

  all = task(async () => {
    if (!this.codeLists) {
      const codeLists = (
        await this.store.request(
          query<CodeList>('code-list', {
            'page[size]': 100,
            include: ['concepts'],
            sort: 'label',
          }),
        )
      ).content;
      await Promise.all(codeLists.map((codeList) => codeList.concepts));

      this.codeLists = codeLists;
    }
    return this.codeLists;
  });
}
