import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadSignCategoryModel extends Model {
  @attr label;
  @hasMany('road-sign-concept', {
    inverse: 'categories',
    async: true,
  })
  roadSignConcepts;
}
