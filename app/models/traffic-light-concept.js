import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class TrafficLightConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr trafficLightConceptCode;
  @belongsTo('traffic-light-concept-status-code') status;
  @hasMany('road-sign-concept', {inverse: "relatedTrafficLightConcepts"}) relatedRoadSignConcepts;
  @hasMany('road-marking-concept', {inverse: "relatedTrafficLightConcepts"}) relatedRoadMarkingConcepts;
  @hasMany('traffic-light-concept', { inverse: null }) relatedTrafficLightConcepts;
}
