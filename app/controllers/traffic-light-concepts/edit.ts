import Controller from '@ember/controller';
import TrafficLightConceptsEditRoute from 'mow-registry/routes/traffic-light-concepts/edit';
import { ModelFrom } from 'mow-registry/utils/type-utils';

export default class TrafficlightConceptsEditController extends Controller {
  declare model: ModelFrom<TrafficLightConceptsEditRoute>;
  reset() {
    this.model.trafficLightConcept.rollbackAttributes();
  }
}
