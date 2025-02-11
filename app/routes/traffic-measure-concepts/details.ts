import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from 'ember-data/store';
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

    return {
      trafficMeasureConcept,
      signs: await trafficMeasureConcept.relatedTrafficSignConcepts,
    };
  }
}
