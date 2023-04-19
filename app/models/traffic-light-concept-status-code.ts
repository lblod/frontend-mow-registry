import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

export default class TrafficLightConceptStatusCodeModel extends Model {
  @attr declare label?: string;
  @hasMany('traffic-light-concept', { inverse: 'status', async: true })
  declare trafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;
}
