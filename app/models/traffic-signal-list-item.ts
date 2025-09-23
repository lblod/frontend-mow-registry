import Model, {
  attr,
  belongsTo,
  type AsyncBelongsTo,
} from '@warp-drive/legacy/model';
import type TrafficSignalConcept from './traffic-signal-concept';
import type { Type } from '@warp-drive/core/types/symbols';

export default class TrafficSignalListItem extends Model {
  declare [Type]: 'traffic-signal-list-item';

  @attr({ defaultValue: -1 }) declare position: number;
  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    async: true,
    polymorphic: true,
    inverse: null,
  })
  declare item: AsyncBelongsTo<TrafficSignalConcept>;
}
