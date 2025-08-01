import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

type Params = {
  id: string;
};
export default class TrafficMeasureConceptsEditRoute extends Route {
  @service declare store: Store;
  async model(params: Params) {
    const trafficMeasureConcept = this.store.findRecord<TrafficMeasureConcept>(
      'traffic-measure-concept',
      params.id,
      {
        include: ['relatedTrafficSignalConceptsOrdered', 'template'],
      },
    );
    return trafficMeasureConcept;
  }
}
