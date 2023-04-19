import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import ConceptModel from './concept';
import type RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

export default class RoadMarkingConceptModel extends ConceptModel {
  @attr declare image?: string;
  @attr declare meaning?: string;
  @attr declare definition?: string;
  @attr declare roadMarkingConceptCode?: string;

  @belongsTo('road-marking-concept-status-code', {
    inverse: 'roadMarkingConcepts',
    async: true,
  })
  declare status: AsyncBelongsTo<RoadSignConceptStatusCodeModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedFromRoadMarkingConcepts',
    async: true,
  })
  declare relatedToRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedToRoadMarkingConcepts',
    async: true,
  })
  declare relatedFromRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;
}
