import { helper } from '@ember/component/helper';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { unwrap } from 'mow-registry/utils/option';

/**
 * Sort an array of road-sign-concepts numerically based on their label
 */
export default helper(function sortByTrafficLightCode([trafficLightConcepts]: [
  TrafficLightConcept[],
]) {
  if (!trafficLightConcepts) {
    return [];
  }

  return [...trafficLightConcepts.slice()].sort((a, b) => {
    return unwrap(a.label).localeCompare(unwrap(b.label), undefined, {
      numeric: true,
    });
  });
});
