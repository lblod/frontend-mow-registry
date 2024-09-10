import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type RoadMarkingConceptStatusCode from './road-marking-concept-status-code';

export default class RoadMarkingConceptStatusModel extends Model {
  declare [Type]: 'road-marking-concept-status';

  @belongsTo<RoadMarkingConceptStatusCode>('road-marking-concept-status-code', {
    inverse: null,
    async: true,
  })
  declare statusCode: AsyncBelongsTo<RoadMarkingConceptStatusCode>;
}
