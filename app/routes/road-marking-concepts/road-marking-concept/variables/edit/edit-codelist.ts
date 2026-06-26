import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type CodeList from 'mow-registry/models/code-list';
import RoadMarkingConceptsRoadMarkingConceptVariablesEditRoute from '../edit';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

type Params = {
  codelistId: string;
};

export default class RoadMarkingConceptsRoadMarkingConceptVariablesEditEditCodelistRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { variable } = this.modelFor(
      'road-marking-concepts.road-marking-concept.variables.edit',
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptVariablesEditRoute>;
    let codelist;
    if (params.codelistId !== 'new') {
      codelist = await this.store
        .request(findRecord<CodeList>('code-list', params.codelistId, {}))
        .then((res) => res.content);
    } else {
      codelist = this.store.createRecord<CodeList>('code-list', {});
    }
    return {
      codelist,
      variable,
    };
  }
}
