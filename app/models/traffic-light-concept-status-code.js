import Model, { attr, hasMany } from '@ember-data/model';

export default class TrafficLightConceptStatusCodeModel extends Model {
  @attr label;
  @hasMany('traffic-light-concept', { inverse: null, async: true })
  trafficLightConcepts;
}
