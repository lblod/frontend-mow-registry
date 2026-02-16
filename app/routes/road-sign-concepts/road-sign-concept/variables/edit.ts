import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type Variable from 'mow-registry/models/variable';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConceptRoute from '../../road-sign-concept';

type Params = {
  variableId: string;
};

export default class RoadSignConceptsRoadSignConceptVariablesEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConceptRoute>;
    let variable;
    if (params.variableId === 'new') {
      variable = this.store.createRecord<Variable>('text-variable', {
        trafficSignalConcept: roadSignConcept as TrafficSignalConcept,
        createdOn: new Date(),
      });
    } else {
      variable = await this.store
        .request(findRecord<Variable>('variable', params.variableId, {}))
        .then((res) => res.content);
    }
    return {
      variable,
    };
  }
}
