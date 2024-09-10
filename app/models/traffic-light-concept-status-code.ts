import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';

export default class TrafficLightConceptStatusCodeModel extends Model {
  declare [Type]: 'traffic-light-concept-status-code';
  @attr declare label?: string;

  @hasMany<TrafficLightConcept>('traffic-light-concept', {
    inverse: 'status',
    async: true,
  })
  declare trafficLightConcepts: AsyncHasMany<TrafficLightConcept>;
}
