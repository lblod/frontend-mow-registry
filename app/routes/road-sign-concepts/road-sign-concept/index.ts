import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { hash } from 'rsvp';
import RoadSignConceptsRoadSignConceptRoute from '../road-sign-concept';

export default class RoadSignConceptsRoadSignConceptIndexRoute extends Route {
  async model() {
    const { mainConcept, isSubSign } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadSignConceptsRoadSignConceptRoute>;
    const relatedToConcepts = await mainConcept.relatedToRoadSignConcepts;
    const relatedFromConcepts = await mainConcept.relatedFromRoadSignConcepts;
    const relatedSigns = [
      ...relatedToConcepts.toArray(),
      ...relatedFromConcepts.toArray(),
    ];
    return hash({
      mainConcept,
      relatedSigns,
      relatedMarkings: mainConcept.relatedRoadMarkingConcepts,
      relatedLights: mainConcept.relatedTrafficLightConcepts,
      isSubSign,
    });
  }
}
