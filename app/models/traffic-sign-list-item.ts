import { type AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
export default class TrafficSignListItem extends Model {
  @attr declare position: number;
  @belongsTo<TrafficSignConcept>('traffic-sign-concept', {
    async: true,
    polymorphic: true,
  })
  declare item: AsyncBelongsTo<TrafficSignConcept>;
}
