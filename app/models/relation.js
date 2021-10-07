import Model, { attr, belongsTo } from '@ember-data/model';

export default class RelationModel extends Model {
  @attr('integer') expectedNumber;
  @attr('string') reason;
  @belongsTo('concept') concept;
}
