import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadSignConceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr roadsignconceptcode;
  @belongsTo('status') status;
  @hasMany('category') categories;
}
