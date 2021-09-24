import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class TrafficLightConceptModel extends Model {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr trafficLightConceptCode;
  @belongsTo('traffic-light-concept-status-code') status;
  @hasMany('road-sign-concept')
  relatedRoadSignConcepts;
  @hasMany('road-marking-concept')
  relatedRoadMarkingConcepts;
  @hasMany('traffic-light-concept', { inverse: null })
  relatedTrafficLightConcepts;
}
