import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Dimension from 'mow-registry/models/dimension';
import QuantityKind from 'mow-registry/models/quantity-kind';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type SkosConcept from 'mow-registry/models/skos-concept';
import TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';
import Unit from 'mow-registry/models/unit';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord<SkosConcept>(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );
    const shapeConcepts =
      await this.store.findAll<TribontShapeClassificationCode>(
        'tribont-shape-classification-code',
      );
    const quantityKinds = await this.store.query<QuantityKind>(
      'quantity-kind',
      {
        // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
        // TODO: fix the query types
        include: 'units',
      },
    );

    const units = await this.store.findAll<Unit>('unit');
    return hash({
      newRoadSignConcept: this.store.createRecord<RoadSignConcept>(
        'road-sign-concept',
        {
          zonality: nonZonalConcept,
        },
      ),
      shapeConcepts,
      quantityKinds,
      units,
      classifications:
        this.store.findAll<RoadSignCategory>('road-sign-category'),
      dimensions: this.store.findAll<Dimension>('dimension'),
    });
  }
}
