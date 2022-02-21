import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class RoadMarkingConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr roadMarkingConceptCode;
  @belongsTo('road-marking-concept-status-code') status;
  @hasMany('road-marking-concept', {
    inverse: 'relatedFromRoadMarkingConcepts',
  })
  relatedToRoadMarkingConcepts;
  @hasMany('road-marking-concept', { inverse: 'relatedToRoadMarkingConcepts' })
  relatedFromRoadMarkingConcepts;
  @hasMany('road-sign-concept', { inverse: 'relatedRoadMarkingConcepts' })
  relatedRoadSignConcepts;
  @hasMany('traffic-light-concept', { inverse: 'relatedRoadMarkingConcepts' })
  relatedTrafficLightConcepts;
}
