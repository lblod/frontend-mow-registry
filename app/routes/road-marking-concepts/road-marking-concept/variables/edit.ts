import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type Variable from 'mow-registry/models/variable';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadMarkingConceptRoute from '../../road-marking-concept';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

type Params = {
  variableId: string;
};

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadMarkingConceptRoute>;
    let variable;
    if (params.variableId === 'new') {
      variable = this.store.createRecord<Variable>('text-variable', {
        trafficSignalConcept: roadMarkingConcept as TrafficSignalConcept,
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
