import Model, { type AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type TrafficSignalConcept from './traffic-signal-concept';
import { Type } from '@warp-drive/core-types/symbols';

export default class TrafficSignalListItem extends Model {
  declare [Type]: 'traffic-signal-list-item';

  @attr declare position?: number;
  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    async: true,
    polymorphic: true,
    inverse: null,
  })
  declare item: AsyncBelongsTo<TrafficSignalConcept>;
}
