import Model, { attr, hasMany } from '@ember-data/model';

export default class RelationModel extends Model {
  @attr('integer') expectedNumber;
  @attr('string') reason;
  @hasMany('concept') concept;
}
