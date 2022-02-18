import { attr, hasMany, belongsTo, A } from '@ember-data/model';
import ConceptModel from './concept';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';


export default class RoadSignConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code') status;
  @hasMany('road-sign-category') categories;
  @hasMany('road-sign-concept', { inverse: 'mainSigns' }) subSigns;
  @hasMany('road-sign-concept', { inverse: 'subSigns' }) mainSigns;
  @belongsTo('skos-concept', { inverse: null }) zonality;
  @hasMany('road-sign-concept', { inverse: 'relatedFromRoadSignConcepts' }) relatedToRoadSignConcepts;
  @hasMany('road-sign-concept', { inverse: 'relatedToRoadSignConcepts' }) relatedFromRoadSignConcepts;
  @hasMany('road-marking-concept', { inverse: 'relatedRoadSignConcepts' }) relatedRoadMarkingConcepts;
  @hasMany('traffic-light-concept', { inverse: 'relatedRoadSignConcepts' }) relatedTrafficLightConcepts;
}
