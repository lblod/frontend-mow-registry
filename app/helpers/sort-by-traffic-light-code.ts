import { helper } from '@ember/component/helper';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import { unwrap } from 'mow-registry/utils/option';

/**
 * Sort an array of road-sign-concepts numerically based on their roadSignConceptCode
 */
export default helper(function sortByTrafficLightCode([trafficLightConcepts]: [
  TrafficLightConceptModel[],
]) {
  if (!trafficLightConcepts) {
    return [];
  }

  return [...trafficLightConcepts.slice()].sort((a, b) => {
    return unwrap(a.trafficLightConceptCode).localeCompare(
      unwrap(b.trafficLightConceptCode),
      undefined,
      {
        numeric: true,
      },
    );
  });
});
