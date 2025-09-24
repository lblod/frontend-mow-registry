import { helper } from '@ember/component/helper';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import { unwrap } from 'mow-registry/utils/option';

/**
 * Sort an array of road-sign-concepts numerically based on their label
 */
export default helper(function sortByRoadSignCode([roadSignConcepts]: [
  (RoadSignConcept | TrafficSignalConcept)[],
]) {
  if (!roadSignConcepts) {
    return [];
  }

  return [...roadSignConcepts.slice()].sort((a, b) => {
    return unwrap(a.label).localeCompare(unwrap(b.label), undefined, {
      numeric: true,
    });
  });
});
