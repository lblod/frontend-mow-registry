import { helper } from '@ember/component/helper';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

/**
 * Sort an array of road-marking-concepts numerically based on their label (label)
 */
export default helper(function sortByPosition([trafficSignalListItems]: [
  TrafficSignalListItem[],
]) {
  if (!trafficSignalListItems || !trafficSignalListItems.length) {
    return [];
  }
  return [...trafficSignalListItems].sort(
    (a, b) => (a.position ?? -1) - (b.position ?? -1),
  );
});
