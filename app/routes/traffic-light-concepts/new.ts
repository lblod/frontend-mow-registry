import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';
import { findRecord } from '@warp-drive/legacy/compat/builders';

export default class TrafficlightConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store
      .request(findRecord<SkosConcept>('skos-concept', ZON_NON_ZONAL_ID))
      .then((res) => res.content);
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
