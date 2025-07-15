import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import CodelistController from 'mow-registry/controllers/codelists-management/codelist';
import type CodeList from 'mow-registry/models/code-list';
import { hash } from 'rsvp';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class CodelistsManagementCodelistRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      codelist: this.store
        .request(
          findRecord<CodeList>('code-list', params.id, {
            include: ['type', 'concepts'].join(),
          }),
        )
        .then((res) => res.content),
    });

    return model;
  }

  resetController(controller: CodelistController) {
    controller.reset();
  }
}
