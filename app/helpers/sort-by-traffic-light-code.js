import { helper } from '@ember/component/helper';

/**
 * Sort an array of road-sign-concepts numerically based on their roadSignConceptCode
 */
export default helper(function sortByTrafficLightCode([trafficLightConcepts]) {
  if (!trafficLightConcepts) {
    return [];
  }

  return [...trafficLightConcepts.slice()].sort((a, b) => {
    return a.trafficLightConceptCode.localeCompare(
      b.trafficLightConceptCode,
      undefined,
      {
        numeric: true,
      },
    );
  });
});
