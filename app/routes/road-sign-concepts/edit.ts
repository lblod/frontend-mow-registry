import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsEditController from 'mow-registry/controllers/road-sign-concepts/edit';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { hash } from 'rsvp';
import { findAll, findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class RoadsignConceptsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return hash({
      roadSignConcept: this.store
        .request(
          findRecord<RoadSignConcept>('road-sign-concept', params.id, {
            include: [
              'image.file',
              'variables',
              'classifications',
              'zonality.inScheme.concepts',
            ],
          }),
        )
        .then((res) => res.content),
      classifications: this.store
        .request(findAll<RoadSignCategory>('road-sign-category'))
        .then((res) => res.content),
    });
  }
  resetController(controller: RoadsignConceptsEditController) {
    controller.reset();
  }
}
