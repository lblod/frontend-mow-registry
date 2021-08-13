import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficlightConcept extends Route {
  @service store;

  async model(params) {
    let model = await hash({
      trafficLightConcept: this.store.findRecord(
        'traffic-light-concept',
        params.id
      ),
    });

    // let relatedSubSigns = await model.roadSignConcept.subSigns;

    return model;
  }

  resetController(controller) {
    controller.reset();
  }
}
