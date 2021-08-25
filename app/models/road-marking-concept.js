import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadMarkingConceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr roadMarkingConceptCode;
  @belongsTo('road-marking-concept-status-code') status;
  @hasMany('road-sign-concept', { inverse: null })
  relatedRoadSignConcepts;
  @hasMany('road-marking-concept', { inverse: null })
  relatedRoadMarkingConcepts;
}
