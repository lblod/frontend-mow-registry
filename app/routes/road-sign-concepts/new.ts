import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type SkosConcept from 'mow-registry/models/skos-concept';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';
import { findAll, findRecord } from '@warp-drive/legacy/compat/builders';

export default class RoadsignConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store
      .request(findRecord<SkosConcept>('skos-concept', ZON_NON_ZONAL_ID))
      .then((res) => res.content);

    return hash({
      newRoadSignConcept: this.store.createRecord<RoadSignConcept>(
        'road-sign-concept',
        {
          zonality: nonZonalConcept,
        },
      ),
      classifications: this.store
        .request(findAll<RoadSignCategory>('road-sign-category'))
        .then((res) => res.content),
    });
  }
}
