import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadMarkingConceptStatusModel extends Model {
  declare [Type]: 'road-marking-concept-status';

  @belongsTo('road-marking-concept-status-code', { inverse: null, async: true })
  declare statusCode: AsyncBelongsTo<RoadSignConceptStatusCodeModel>;
}
