import { helper } from '@ember/component/helper';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import { unwrap } from 'mow-registry/utils/option';

/**
 * Sort an array of road-marking-concepts numerically based on their label (label)
 */
export default helper(function sortByRoadMarkingCode([roadMarkingConcepts]: [
  RoadMarkingConceptModel[],
]) {
  if (!roadMarkingConcepts) {
    return [];
  }

  return [...roadMarkingConcepts.slice()].sort((a, b) => {
    return unwrap(a.label).localeCompare(unwrap(b.label), undefined, {
      numeric: true,
    });
  });
});
