import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import CodelistController from 'mow-registry/controllers/codelists-management/codelist';
import type CodeList from 'mow-registry/models/code-list';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class CodelistsManagementCodelistRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const codelist = await this.store
      .request(
        findRecord<CodeList>('code-list', params.id, {
          include: ['type', 'concepts'],
        }),
      )
      .then((res) => res.content);
    const concepts = [...(await codelist.concepts)].sort(
      (a, b) =>
        ('position' in a ? ((a.position as number) ?? 0) : -1) -
        ('position' in b ? ((b.position as number) ?? 0) : -1),
    );
    const model = {
      codelist,
      concepts,
    };

    return model;
  }

  resetController(controller: CodelistController) {
    controller.reset();
  }
}
