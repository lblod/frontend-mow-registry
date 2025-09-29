import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};

export default class RoadmarkingConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      roadMarkingConcept: await this.store
        .request(
          findRecord<RoadMarkingConcept>('road-marking-concept', params.id, {
            include: [
              'image.file',
              'variables',
              'zonality.inScheme.concepts',
              'inScheme.concepts',
              'relatedRoadSignConcepts',
              'relatedToRoadMarkingConcepts',
              'relatedFromRoadMarkingConcepts',
              'relatedTrafficLightConcepts',
              'hasInstructions',
            ],
          }),
        )
        .then((res) => res.content),
    };
  }
}
