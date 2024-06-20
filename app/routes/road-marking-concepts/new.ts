import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';

export default class RoadmarkingConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );
    return hash({
      newRoadMarkingConcept: this.store.createRecord('road-marking-concept', {
        zonality: nonZonalConcept,
      }),
    });
  }
}
