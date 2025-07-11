import Model, { type AsyncHasMany, attr, hasMany } from '@warp-drive/legacy/model';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type { Type } from '@warp-drive/core/types/symbols';

export default class RoadMarkingConceptStatusCode extends Model {
  declare [Type]: 'road-marking-concept-status-code';
  @attr declare label?: string;
  @hasMany<RoadMarkingConcept>('road-marking-concept', {
    inverse: 'status',
    async: true,
  })
  declare roadMarkingConcepts: AsyncHasMany<RoadMarkingConcept>;
}
