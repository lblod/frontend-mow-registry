import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import RoadSignConcept from './road-sign-concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadSignCategoryModel extends Model {
  declare [Type]: 'road-sign-category';
  @attr declare label?: string;
  @hasMany<RoadSignConcept>('road-sign-concept', {
    async: true,
    inverse: 'classifications',
  })
  declare roadSignConcepts: AsyncHasMany<RoadSignConcept>;
}
