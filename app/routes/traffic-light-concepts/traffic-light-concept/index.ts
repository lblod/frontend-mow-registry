import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { hash } from 'rsvp';
import TrafficLightConceptsTrafficlightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';

export default class TrafficLightConceptsTrafficLightConceptIndexRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept'
    ) as ModelFrom<TrafficLightConceptsTrafficlightConceptRoute>;
    const relatedToConcepts = await mainConcept.relatedToTrafficLightConcepts;
    const relatedFromConcepts =
      await mainConcept.relatedFromTrafficLightConcepts;
    const relatedLights = [
      ...relatedToConcepts.toArray(),
      ...relatedFromConcepts.toArray(),
    ];
    return hash({
      mainConcept,
      relatedSigns: mainConcept.relatedRoadSignConcepts,
      relatedMarkings: mainConcept.relatedRoadMarkingConcepts,
      relatedLights,
    });
  }
}
