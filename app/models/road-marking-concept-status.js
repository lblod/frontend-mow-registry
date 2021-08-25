import Model, { belongsTo } from '@ember-data/model';

export default class RoadMarkingConceptStatusModel extends Model {
  @belongsTo('road-marking-concept-status-code') statusCode;
}
