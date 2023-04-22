import ConceptRoute from './concept-route';
export default class RelatedLightsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    if (mainConcept.relatedTrafficLightConcepts) {
      let related = await mainConcept.relatedTrafficLightConcepts;
      return { mainConcept, related };
    } else {
      let relatedFrom = await mainConcept.relatedFromTrafficLightConcepts;
      let relatedTo = await mainConcept.relatedToTrafficLightConcepts;
      return { mainConcept, relatedFrom, relatedTo };
    }
  }
}
