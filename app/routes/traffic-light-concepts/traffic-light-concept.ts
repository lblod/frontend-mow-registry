import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'ember-data/store';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

type Params = {
  id: string;
};

export default class TrafficlightConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      trafficLightConcept:
        await this.store.findRecord<TrafficLightConceptModel>(
          'traffic-light-concept',
          params.id,
        ),
    };
  }
}
