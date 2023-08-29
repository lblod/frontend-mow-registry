import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-marking-concept-status': RoadMarkingConceptStatusModel;
  }
}

export default class RoadMarkingConceptStatusModel extends Model {
  @belongsTo('road-marking-concept-status-code', { inverse: null, async: true })
  declare statusCode: AsyncBelongsTo<RoadSignConceptStatusCodeModel>;
}
