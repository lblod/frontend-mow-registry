import Model, { type AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadSignConceptStatusCode extends Model {
  declare [Type]: 'road-sign-concept-status-code';
  @attr declare label?: string;
  @hasMany('road-sign-concept', { inverse: 'status', async: true })
  declare roadSignConcepts: AsyncHasMany<RoadSignConcept>;
}
