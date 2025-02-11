import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type SkosConcept from 'mow-registry/models/skos-concept';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord<SkosConcept>(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );

    return hash({
      newRoadSignConcept: this.store.createRecord<RoadSignConcept>(
        'road-sign-concept',
        {
          zonality: nonZonalConcept,
        },
      ),
      classifications:
        this.store.findAll<RoadSignCategory>('road-sign-category'),
    });
  }
}
