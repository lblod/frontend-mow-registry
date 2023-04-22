import ConceptRoute from './concept-route';
export default class RelatedLightsRoute extends ConceptRoute {
  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    if (mainConcept.relatedFromTrafficLightConcepts) {
      let relatedFrom = await mainConcept.relatedFromTrafficLightConcepts;
      let relatedTo = await mainConcept.relatedToTrafficLightConcepts;
      return { mainConcept, relatedFrom, relatedTo };
    } else {
      let related = await mainConcept.relatedTrafficLightConcepts;
      return { mainConcept, related };
    }
  }
}
