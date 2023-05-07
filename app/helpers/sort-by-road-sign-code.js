import { helper } from '@ember/component/helper';

/**
 * Sort an array of road-sign-concepts numerically based on their roadSignConceptCode
 */
export default helper(function sortByRoadSignCode([roadSignConcepts]) {
  if (!roadSignConcepts) {
    return [];
  }

  return [...roadSignConcepts.slice()].sort((a, b) => {
    return a.roadSignConceptCode.localeCompare(
      b.roadSignConceptCode,
      undefined,
      {
        numeric: true,
      }
    );
  });
});
