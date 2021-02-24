import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadSignConceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code') status;
  @hasMany('road-sign-category') categories;
  @hasMany('road-sign-concept', { inverse: null }) relatedRoadSignConcepts;
  @hasMany('road-sign-concept', { inverse: null }) subSigns;
}
