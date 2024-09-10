import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsEditController from 'mow-registry/controllers/road-sign-concepts/edit';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class RoadsignConceptsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
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
      roadSignConcept: this.store.findRecord<RoadSignConcept>(
        'road-sign-concept',
        params.id,
      ),
      classifications:
        this.store.findAll<RoadSignCategory>('road-sign-category'),
      shapeConcepts,
      quantityKinds,
      units,
    });
  }
  resetController(controller: RoadsignConceptsEditController) {
    controller.reset();
  }
}
