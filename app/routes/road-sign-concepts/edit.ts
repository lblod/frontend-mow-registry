import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsEditController from 'mow-registry/controllers/road-sign-concepts/edit';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class RoadsignConceptsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return hash({
      roadSignConcept: this.store.findRecord<RoadSignConcept>(
        'road-sign-concept',
        params.id,
        {
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          include: 'shapes.dimensions.kind',
        },
      ),
      classifications:
        this.store.findAll<RoadSignCategory>('road-sign-category'),
    });
  }
  resetController(controller: RoadsignConceptsEditController) {
    controller.reset();
  }
}
