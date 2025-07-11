import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

type Params = {
  id: string;
};

export default class RoadsignConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const data = await hash({
      roadSignConcept: this.store.findRecord<RoadSignConceptModel>(
        'road-sign-concept',
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
            'classifications',
            'zonality.inScheme.concepts',
            'inScheme.concepts',
            'relatedToRoadSignConcepts',
            'relatedFromRoadSignConcepts',
            'relatedRoadMarkingConcepts',
            'relatedTrafficLightConcepts',
            'hasInstructions',
          ],
        },
      ),
    });

    data.roadSignConcept.relatedRoadSignConcepts = new TrackedArray([
      ...(await data.roadSignConcept.relatedToRoadSignConcepts),
      ...(await data.roadSignConcept.relatedFromRoadSignConcepts),
    ]);

    return data;
  }
}
