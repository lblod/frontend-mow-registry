import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadSignCombinationModel extends Model {
  @attr identifier;
  @hasMany('measure-concept') measureConcepts;
  @belongsTo('road-sign-concept') roadSignConcept;
}
