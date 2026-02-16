import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type Variable from 'mow-registry/models/variable';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type TrafficLightConceptRoute from '../../traffic-light-concept';

type Params = {
  variableId: string;
};

export default class TrafficLightConceptsTrafficLightConceptVariablesEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficLightConceptRoute>;
    let variable;
    if (params.variableId === 'new') {
      variable = this.store.createRecord<Variable>('text-variable', {
        trafficSignalConcept: trafficLightConcept as TrafficSignalConcept,
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
