import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type TrafficLightConceptStatusCodeModel from 'mow-registry/models/traffic-light-concept-status-code';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'traffic-light-concept-status': TrafficLightConceptStatusModel;
  }
}
export default class TrafficLightConceptStatusModel extends Model {
  @belongsTo('traffic-light-concept-status-code', {
    inverse: null,
    async: true,
  })
  declare statusCode: AsyncBelongsTo<TrafficLightConceptStatusCodeModel>;
}
