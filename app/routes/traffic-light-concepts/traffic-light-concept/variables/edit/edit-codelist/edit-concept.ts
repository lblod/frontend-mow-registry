import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import type SkosConcept from 'mow-registry/models/skos-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type CodeListValue from 'mow-registry/models/code-list-value';

type Params = {
  conceptId: string;
};

export default class TrafficLightConceptsTrafficLightConceptVariablesEditEditCodelistEditConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const concept = await this.store
      .request(findRecord<SkosConcept>('skos-concept', params.conceptId, {}))
      .then((res) => res.content);
    if (!concept) {
      return {
        concept: await this.store
          .request(
            findRecord<CodeListValue>('code-list-value', params.conceptId, {}),
          )
          .then((res) => res.content),
      };
    }
    return { concept };
  }
}
