import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class RoadMarkingConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr roadMarkingConceptCode;
  @belongsTo('road-marking-concept-status-code', {
    inverse: 'roadMarkingConcepts',
    async: true,
  })
  status;
  @hasMany('road-marking-concept', {
    inverse: 'relatedFromRoadMarkingConcepts',
    async: true,
  })
  relatedToRoadMarkingConcepts;
  @hasMany('road-marking-concept', {
    inverse: 'relatedToRoadMarkingConcepts',
    async: true,
  })
  relatedFromRoadMarkingConcepts;
  @hasMany('road-sign-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  relatedRoadSignConcepts;
  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  relatedTrafficLightConcepts;
}
