import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import ConceptModel from './concept';
import type RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';
import type RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

export default class RoadSignConceptModel extends ConceptModel {
  @attr declare image?: string;
  @attr declare meaning?: string;
  @attr declare roadSignConceptCode?: string;

  @belongsTo('road-sign-concept-status-code', {
    inverse: 'roadSignConcepts',
    async: true,
  })
  declare status: AsyncBelongsTo<RoadSignConceptStatusCodeModel>;

  @hasMany('road-sign-category', { inverse: 'roadSignConcepts', async: true })
  declare categories: AsyncHasMany<RoadSignCategoryModel>;

  @hasMany('road-sign-concept', { inverse: 'mainSigns', async: true })
  declare subSigns: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', { inverse: 'subSigns', async: true })
  declare mainSigns: AsyncHasMany<RoadSignConceptModel>;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedFromRoadSignConcepts',
    async: true,
  })
  declare relatedToRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedToRoadSignConcepts',
    async: true,
  })
  declare relatedFromRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;
}