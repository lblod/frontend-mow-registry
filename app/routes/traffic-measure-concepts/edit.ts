import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class TrafficMeasureConceptsEditRoute extends Route {
  @service declare store: Store;
  async model(params: Params) {
    const trafficMeasureConcept = this.store
      .request(
        findRecord<TrafficMeasureConcept>('traffic-measure-concept', params.id),
      )
      .then((res) => res.content);
    return trafficMeasureConcept;
  }
}
