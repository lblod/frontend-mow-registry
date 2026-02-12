import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type Variable from 'mow-registry/models/variable';

type Params = {
  variableId: string;
};

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      variable: await this.store
        .request(findRecord<Variable>('variable', params.variableId, {}))
        .then((res) => res.content),
    };
  }
}
