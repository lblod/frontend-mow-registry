import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import CodelistController from 'mow-registry/controllers/codelists-management/codelist';
import type CodeList from 'mow-registry/models/code-list';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class CodelistsManagementCodelistRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      codelist: this.store.findRecord<CodeList>('code-list', params.id, {
        // @ts-expect-error: The types expect an array, but the adapter doesn't convert that to the expected json:api include format
        // More info: https://github.com/emberjs/data/pull/9507#issuecomment-2219588690
        include: ['type', 'concepts'].join(),
      }),
    });

    return model;
  }

  resetController(controller: CodelistController) {
    controller.reset();
  }
}
