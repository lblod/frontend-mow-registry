import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadSignConceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code') status;
  @hasMany('road-sign-category') categories;
  @hasMany('road-sign-concept', { inverse: null }) relatedRoadSignConcepts;
  @hasMany('road-sign-concept', { inverse: 'mainSigns' }) subSigns;
  @hasMany('road-sign-concept', { inverse: 'subSigns' }) mainSigns;
  @hasMany('road-measure', { inverse: 'roadSignConcepts' }) measures;
}
