import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

type Params = {
  id: string;
};

export default class TrafficMeasureConceptsDetailsRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const trafficMeasureConcept =
      await this.store.findRecord<TrafficMeasureConcept>(
        'traffic-measure-concept',
        params.id,
      );
    const signs = Array.from(
      await trafficMeasureConcept.relatedTrafficSignalConceptsOrdered,
    );
    return {
      trafficMeasureConcept,
      signs: signs.sort((a, b) => a.position - b.position),
    };
  }
}
