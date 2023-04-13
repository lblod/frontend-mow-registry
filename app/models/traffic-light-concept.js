import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class TrafficLightConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr definition;
  @attr trafficLightConceptCode;
  @belongsTo('traffic-light-concept-status-code', {
    inverse: null,
    async: true,
  })
  status;
  @hasMany('traffic-light-concept', {
    inverse: 'relatedFromTrafficLightConcepts',
    async: true,
  })
  relatedToTrafficLightConcepts;
  @hasMany('traffic-light-concept', {
    inverse: 'relatedToTrafficLightConcepts',
    async: true,
  })
  relatedFromTrafficLightConcepts;
  @hasMany('road-sign-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  relatedRoadSignConcepts;
  @hasMany('road-marking-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  relatedRoadMarkingConcepts;
}
