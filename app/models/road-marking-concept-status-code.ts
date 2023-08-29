import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-marking-concept-status-code': RoadMarkingConceptStatusCodeModel;
  }
}
export default class RoadMarkingConceptStatusCodeModel extends Model {
  @attr declare label?: string;
  @hasMany('road-marking-concept', { inverse: 'status', async: true })
  declare roadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;
}
