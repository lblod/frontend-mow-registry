import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { hash } from 'rsvp';
import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';

export default class RoadMarkingConceptsRoadMarkingConceptIndexRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    const relatedToConcepts = await mainConcept.relatedToRoadMarkingConcepts;
    const relatedFromConcepts =
      await mainConcept.relatedFromRoadMarkingConcepts;
    const relatedMarkings = [
      ...relatedToConcepts.toArray(),
      ...relatedFromConcepts.toArray(),
    ];
    return hash({
      mainConcept,
      relatedSigns: mainConcept.relatedRoadSignConcepts,
      relatedMarkings,
      relatedLights: mainConcept.relatedTrafficLightConcepts,
    });
  }
}
