import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';

type Params = {
  id: string;
};
export default class CodelistsManagementEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const codelist = await this.store.findRecord<CodeList>(
      'code-list',
      params.id,
    );
    const concepts = await codelist.concepts;

    return {
      codelist,
      concepts,
    };
  }
}
