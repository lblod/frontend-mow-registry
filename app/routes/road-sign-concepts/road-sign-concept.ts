import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};

export default class RoadsignConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const data = await hash({
      roadSignConcept: this.store
        .request(
          findRecord<RoadSignConceptModel>('road-sign-concept', params.id, {
            include: [
              'image.file',
              'variables',
              'classifications',
              'zonality.inScheme.concepts',
              'inScheme.concepts',
              'relatedToRoadSignConcepts',
              'relatedFromRoadSignConcepts',
              'relatedRoadMarkingConcepts',
              'relatedTrafficLightConcepts',
              'canContainSignals',
              'canBeContainedInSignals',
              'hasInstructions',
            ],
          }),
        )
        .then((res) => res.content),
    });

    data.roadSignConcept.relatedRoadSignConcepts = new TrackedArray([
      ...(await data.roadSignConcept.relatedToRoadSignConcepts),
      ...(await data.roadSignConcept.relatedFromRoadSignConcepts),
    ]);

    return data;
  }
}
