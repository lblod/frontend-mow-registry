import ConceptRoute from './concept-route';

export default class RelatedMarkingsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    if (mainConcept.relatedFromRoadMarkingConcepts) {
      let relatedFrom = await mainConcept.relatedFromRoadMarkingConcepts;
      let relatedTo = await mainConcept.relatedToRoadMarkingConcepts;
      return { mainConcept, relatedFrom, relatedTo };
    } else {
      let related = await mainConcept.relatedRoadMarkingConcepts;
      return { mainConcept, related };
    }
  }
}
