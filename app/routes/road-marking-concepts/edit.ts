import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadmarkingConceptsEditController from 'mow-registry/controllers/road-marking-concepts/edit';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};

export default class RoadmarkingConceptsEditRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    return hash({
      roadMarkingConcept: this.store.findRecord<RoadMarkingConcept>(
        'road-marking-concept',
        params.id,
        {
          include: [
            'shapes.dimensions.kind',
            'shapes.dimensions.unit',
            'shapes.classification',
            'defaultShape.dimensions',
            'defaultShape.classification',
            'image.file',
            'variables',
            'zonality.inScheme.concepts',
            'inScheme.concepts',
          ],
        },
      ),
    });
  }
  resetController(controller: RoadmarkingConceptsEditController) {
    controller.reset();
  }
}
