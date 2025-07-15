import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class CodelistsManagementEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const codelist = await this.store
      .request(findRecord<CodeList>('code-list', params.id))
      .then((res) => res.content);
    const concepts = await codelist.concepts;

    return {
      codelist,
      concepts,
    };
  }
}
