import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import SkosConcept from './skos-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-sign-category': RoadSignCategoryModel;
  }
}

export default class RoadSignCategoryModel extends Model {
  @attr declare label?: string;
  @hasMany('skos-concept', {
    async: true,
  })
  declare skosConcepts: AsyncHasMany<SkosConcept>;
}
