import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import TrafficSignConceptModel from './traffic-sign-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-sign-concept': RoadSignConceptModel;
  }
}
export default class RoadSignConceptModel extends TrafficSignConceptModel {
  @attr declare meaning?: string;

  @hasMany('skos-concept', { inverse: null, async: true })
  declare classifications: AsyncHasMany<SkosConcept>; // debug: categories renamed to classifications -> undefined in app

  @hasMany('road-sign-concept', { inverse: 'mainSigns', async: true })
  declare subSigns: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', { inverse: 'subSigns', async: true })
  declare mainSigns: AsyncHasMany<RoadSignConceptModel>;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>; // debug: present in app

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

  relatedRoadSignConcepts?: Array<RoadSignConceptModel>;

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
