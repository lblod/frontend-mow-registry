import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CodelistsManagementEditRoute extends Route {
  @service store;

  async model(params) {
    let codelist = await this.store.findRecord('code-list', params.id);
    let codelistOptions = await codelist.codeListOptions;

    return {
      codelist,
      codelistOptions,
    };
  }
}
