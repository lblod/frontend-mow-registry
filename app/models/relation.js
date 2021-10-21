import Model, { attr, belongsTo } from '@ember-data/model';

export default class RelationModel extends Model {
  @attr('number') expectedNumber;
  @attr('string') reason;
  @attr('number') order;
  @belongsTo('concept', { inverse: null }) concept;
}
