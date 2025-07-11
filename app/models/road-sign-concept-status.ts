import Model, {
  type AsyncBelongsTo,
  belongsTo,
} from '@warp-drive/legacy/model';
import type RoadSignConceptStatusCode from 'mow-registry/models/road-sign-concept-status-code';
import type { Type } from '@warp-drive/core/types/symbols';

export default class RoadSignConceptStatus extends Model {
  declare [Type]: 'road-sign-concept-status';

  @belongsTo('road-sign-concept-status-code', { inverse: null, async: true })
  declare statusCode: AsyncBelongsTo<RoadSignConceptStatusCode>;
}
