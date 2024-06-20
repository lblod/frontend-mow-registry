import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import TrafficSignConceptModel from './traffic-sign-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    relation: RelationModel;
  }
}

export default class RelationModel extends Model {
  @attr('number') declare expectedNumber?: number;
  @attr('string') declare reason?: string;
  @attr('number') declare order?: number;
  @belongsTo('traffic-sign-concept', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare trafficSignConcept: AsyncBelongsTo<TrafficSignConceptModel>;
}
