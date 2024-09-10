import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadMarkingConceptStatusCodeModel extends Model {
  declare [Type]: 'road-marking-concept-status-code';
  @attr declare label?: string;
  @hasMany('road-marking-concept', { inverse: 'status', async: true })
  declare roadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;
}
