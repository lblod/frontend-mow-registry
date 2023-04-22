import ConceptRoute from './concept-route';

export default class RelatedMarkingsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    if (mainConcept.relatedRoadMarkingConcepts) {
      let related = await mainConcept.relatedRoadMarkingConcepts;
      return { mainConcept, related };
    } else {
      let relatedFrom = await mainConcept.relatedFromRoadMarkingConcepts;
      let relatedTo = await mainConcept.relatedToRoadMarkingConcepts;
      return { mainConcept, relatedFrom, relatedTo };
    }
  }
}
