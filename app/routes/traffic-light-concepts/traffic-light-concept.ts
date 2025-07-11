import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

type Params = {
  id: string;
};

export default class TrafficlightConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      trafficLightConcept:
        await this.store.findRecord<TrafficLightConceptModel>(
          'traffic-light-concept',
          params.id,
          {
            include: [
              'image.file',
              'variables',
              'zonality.inScheme.concepts',
              'inScheme.concepts',
              'relatedRoadSignConcepts',
              'relatedRoadMarkingConcepts',
              'relatedToTrafficLightConcepts',
              'relatedFromTrafficLightConcepts',
              'hasInstructions',
            ],
          },
        ),
    };
  }
}
