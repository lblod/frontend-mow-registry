import { helper } from '@ember/component/helper';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import { unwrap } from 'mow-registry/utils/option';

/**
 * Sort an array of road-sign-concepts numerically based on their label
 */
export default helper(function sortByRoadSignCode([roadSignConcepts]: [
  RoadSignConceptModel[],
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
