import Controller from '@ember/controller';

export default class TrafficlightConceptsEditController extends Controller {
  reset() {
    this.model.trafficLightConcept.rollbackAttributes();
  }
}
