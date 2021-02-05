import Model, { belongsTo } from '@ember-data/model';

export default class RoadSignConceptStatusModel extends Model {
  @belongsTo('road-sign-concept-status-code') statusCode;
}
