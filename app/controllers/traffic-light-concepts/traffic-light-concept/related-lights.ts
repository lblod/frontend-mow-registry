import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficLightConceptsTrafficLightConceptRelatedLightsRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept/related-lights';

export default class TrafficLightConceptsTrafficLightConceptRelatedLightsController extends Controller {
  declare model: ModelFrom<TrafficLightConceptsTrafficLightConceptRelatedLightsRoute>;

  get related() {
    return [
      ...this.model.relatedTo.toArray(),
      ...this.model.relatedFrom.toArray(),
    ];
  }
}
