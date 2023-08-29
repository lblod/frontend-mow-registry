import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import CodelistController from 'mow-registry/controllers/codelists-management/codelist';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class CodelistsManagementCodelistRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      codelist: this.store.findRecord('code-list', params.id),
    });

    return model;
  }

  resetController(controller: CodelistController) {
    controller.reset();
  }
}
