import Route from '@ember/routing/route';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import type Variable from 'mow-registry/models/variable';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type RoadMarkingConceptRoute from '../../road-marking-concept';
import type { RouteParams } from 'mow-registry/utils/routeParams';

type Params = {
  variableId: string;
};

export default class RoadMarkingConceptsRoadMarkingConceptVariablesEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    let variable;
    if (params.variableId === 'new') {
      const conceptId = (
        this.paramsFor(
          'road-marking-concepts.road-marking-concept',
        ) as RouteParams<RoadMarkingConceptRoute>
      ).id;
      if (!conceptId) {
        throw new Error(
          "Expected conceptId route param, but didn't get one. This should not happen.",
        );
      }

      const trafficSignalConcept = await this.store
        .request(
          findRecord<TrafficSignalConcept>(
            'traffic-signal-concept',
            conceptId,
            {},
          ),
        )
        .then((res) => res.content);
      variable = this.store.createRecord<Variable>('text-variable', {
        trafficSignalConcept: trafficSignalConcept,
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
