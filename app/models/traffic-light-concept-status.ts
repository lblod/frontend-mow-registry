import Model, { type AsyncBelongsTo, belongsTo } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';
import type TrafficLightConceptStatusCode from 'mow-registry/models/traffic-light-concept-status-code';

export default class TrafficLightConceptStatus extends Model {
  declare [Type]: 'traffic-light-concept-status';
  @belongsTo<TrafficLightConceptStatusCode>(
    'traffic-light-concept-status-code',
    {
      inverse: null,
      async: true,
    },
  )
  declare statusCode: AsyncBelongsTo<TrafficLightConceptStatusCode>;
}
