import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import ConceptModel from './concept';
import TrafficLightConceptStatusCodeModel from 'mow-registry/models/traffic-light-concept-status-code';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';

export default class TrafficLightConceptModel extends ConceptModel {
  @attr declare image?: string;
  @attr declare meaning?: string;
  @attr declare definition?: string;
  @attr declare trafficLightConceptCode?: string;

  @belongsTo('traffic-light-concept-status-code', {
    inverse: 'trafficLightConcepts',
    async: true,
  })
  declare status: AsyncBelongsTo<TrafficLightConceptStatusCodeModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedFromTrafficLightConcepts',
    async: true,
  })
  declare relatedToTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedToTrafficLightConcepts',
    async: true,
  })
  declare relatedFromTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;
}