import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};

export default class TrafficlightConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      trafficLightConcept: await this.store
        .request(
          findRecord<TrafficLightConceptModel>(
            'traffic-light-concept',
            params.id,
            {
              include: [
                'image.file',
                'variables',
                'relatedRoadSignConcepts',
                'relatedRoadMarkingConcepts',
                'relatedToTrafficLightConcepts',
                'relatedFromTrafficLightConcepts',
                'hasInstructions',
              ],
            },
          ),
        )
        .then((res) => res.content),
    };
  }
}
