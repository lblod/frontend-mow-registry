import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import RoadSignConceptModel from './road-sign-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-sign-category': RoadSignCategoryModel;
  }
}

export default class RoadSignCategoryModel extends Model {
  @attr declare label?: string;
  @hasMany('road-sign-concept', {
    async: true,
    inverse: 'classifications',
  })
  declare roadSignConcepts: AsyncHasMany<RoadSignConceptModel>;
}
