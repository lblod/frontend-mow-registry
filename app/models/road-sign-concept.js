import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class RoadSignConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code') status;
  @hasMany('road-sign-category') categories;
  @hasMany('road-sign-concept', { inverse: null }) relatedRoadSignConcepts;
  @hasMany('road-sign-concept', { inverse: 'mainSigns' }) subSigns;
  @hasMany('road-sign-concept', { inverse: 'subSigns' }) mainSigns;
  @hasMany('road-marking-concept')
  relatedRoadMarkingConcepts;
  @hasMany('traffic-light-concept')
  relatedTrafficLightConcepts;
}
