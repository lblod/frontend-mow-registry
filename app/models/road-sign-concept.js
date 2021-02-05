import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadsignconceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code') status;
  @hasMany('road-sign-category') categories;
}
