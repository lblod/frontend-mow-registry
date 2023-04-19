import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import TrafficLightConceptStatusCodeModel from 'mow-registry/models/traffic-light-concept-status-code';

export default class TrafficLightConceptStatusModel extends Model {
  @belongsTo('traffic-light-concept-status-code', {
    inverse: null,
    async: true,
  })
  declare statusCode: AsyncBelongsTo<TrafficLightConceptStatusCodeModel>;
}
