import { helper } from '@ember/component/helper';

/**
 * Sort an array of road-marking-concepts numerically based on their roadMarkingConceptCode
 */
export default helper(function sortByRoadMarkingCode([roadMarkingConcepts]) {
  if (!roadMarkingConcepts) {
    return [];
  }

  return [...roadMarkingConcepts.toArray()].sort((a, b) => {
    return a.roadMarkingConceptCode.localeCompare(
      b.roadMarkingConceptCode,
      undefined,
      {
        numeric: true,
      }
    );
  });
});
