import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class CodelistsManagementEditRoute extends Route {
  @service store;

  async model(params) {
    let model = await hash({
      codelist: this.store.findRecord('code-list', params.id),
    });

    let codelistOptions = await model.codelist.codeListOptions;
    model.codelistOptions = codelistOptions;

    return model;
  }

  resetController(controller) {
    controller.reset();
  }
}
