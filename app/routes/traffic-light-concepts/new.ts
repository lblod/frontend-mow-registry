import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';

export default class TrafficlightConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord<SkosConcept>(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );
    return hash({
      newTrafficLightConcept: this.store.createRecord<TrafficLightConcept>(
        'traffic-light-concept',
        {
          zonality: nonZonalConcept,
        },
      ),
    });
  }
}
