import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TrafficlightConceptsEditController from 'mow-registry/controllers/traffic-light-concepts/edit';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class TrafficLightConceptsEditRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    return hash({
      trafficLightConcept: this.store
        .request(
          findRecord<TrafficLightConcept>('traffic-light-concept', params.id, {
            include: [
              'image.file',
              'variables',
              'zonality.inScheme.concepts',
              'inScheme.concepts',
            ],
          }),
        )
        .then((res) => res.content),
    });
  }
  resetController(controller: TrafficlightConceptsEditController) {
    controller.reset();
  }
}
