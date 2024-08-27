import { AsyncHasMany } from '@ember-data/model';
import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import QuantityKindModel from 'mow-registry/models/quantity-kind';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );
    const shapeConcepts = await this.store.findAll(
      'tribont-shape-classificatie-code',
    );
    const quantityKinds = await this.store.query('quantity-kind', {
      include: 'units',
    });

    const units = await this.store.findAll('unit');
    return hash({
      newRoadSignConcept: this.store.createRecord('road-sign-concept', {
        zonality: nonZonalConcept,
      }),
      shapeConcepts,
      quantityKinds,
      units,
      shapes: [],
      classifications: this.store.findAll('road-sign-category'),
      dimensions: this.store.findAll('dimension'),
    });
  }
}
