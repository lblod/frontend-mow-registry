import Model, { type AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type TrafficSignalConcept from './traffic-signal-concept';
export default class TrafficSignalListItem extends Model {
  @attr declare position?: number;
  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    async: true,
    polymorphic: true,
    inverse: null,
  })
  declare item: AsyncBelongsTo<TrafficSignalConcept>;
}
