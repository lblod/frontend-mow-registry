import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadSignConceptStatusCodeModel extends Model {
  declare [Type]: 'road-sign-concept-status-code';
  @attr declare label?: string;
  @hasMany('road-sign-concept', { inverse: 'status', async: true })
  declare roadSignConcepts: AsyncHasMany<RoadSignConceptModel>;
}
