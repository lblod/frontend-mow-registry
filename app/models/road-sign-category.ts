import Model, { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-sign-category': RoadSignCategoryModel;
  }
}

export default class RoadSignCategoryModel extends Model {
  @attr declare label?: string;
  // @hasMany('skos-concept', {
  //   async: true,
  //   inverse: null,
  // })
  // declare skosConcepts: AsyncHasMany<SkosConcept>;
}
