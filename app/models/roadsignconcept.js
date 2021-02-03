import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadsignconceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr roadsignconceptcode;
  @belongsTo('roadsignconcept-status-code') status;
  @hasMany('roadsigncategory') categories;
}
