import ConceptRoute from './concept-route';

export default class RelatedMarkingsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    const relatedConcepts = await mainConcept.relatedRoadMarkingConcepts;
    return { mainConcept, relatedConcepts };
  }
}
