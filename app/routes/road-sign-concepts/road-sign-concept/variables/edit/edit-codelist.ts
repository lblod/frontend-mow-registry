import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type CodeList from 'mow-registry/models/code-list';

type Params = {
  codelistId: string;
};

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      codelist: await this.store
        .request(findRecord<CodeList>('code-list', params.codelistId, {}))
        .then((res) => res.content),
    };
  }
}
