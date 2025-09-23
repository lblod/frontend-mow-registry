import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};

export default class TrafficMeasureConceptsDetailsRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const trafficMeasureConcept = await this.store
      .request(
        findRecord<TrafficMeasureConcept>('traffic-measure-concept', params.id),
      )
      .then((res) => res.content);
    const signs = Array.from(
      await trafficMeasureConcept.relatedTrafficSignalConceptsOrdered,
    );

    return {
      trafficMeasureConcept,
      signs: signs.sort((a, b) => a.position - b.position),
    };
  }
}
