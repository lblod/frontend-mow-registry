import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

type Params = {
  id: string;
};
export default class CodelistsManagementEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const codelist = await this.store.findRecord('code-list', params.id);
    const concepts = await codelist.concepts;

    return {
      codelist,
      concepts,
    };
  }
}
