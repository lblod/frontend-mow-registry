import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-sign-concept-status-code': RoadSignConceptStatusCodeModel;
  }
}

export default class RoadSignConceptStatusCodeModel extends Model {
  @attr declare label?: string;
  @hasMany('road-sign-concept', { inverse: 'status', async: true })
  declare roadSignConcepts: AsyncHasMany<RoadSignConceptModel>;
}
