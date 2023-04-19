import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

export default class RoadSignCategoryModel extends Model {
  @attr declare label?: string;
  @hasMany('road-sign-concept', {
    inverse: 'categories',
    async: true,
  })
  declare roadSignConcepts: AsyncHasMany<RoadSignConceptModel>;
}
