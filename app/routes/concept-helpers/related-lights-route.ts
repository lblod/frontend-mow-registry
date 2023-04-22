import ConceptRoute from './concept-route';
export default class RelatedLightsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    const relatedConcepts = await mainConcept.relatedTrafficLightConcepts;
    return { mainConcept, relatedConcepts };
  }
}
