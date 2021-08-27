import Model, { belongsTo } from '@ember-data/model';

export default class TrafficLightConceptStatusModel extends Model {
  @belongsTo('traffic-light-concept-status-code') statusCode;
}
