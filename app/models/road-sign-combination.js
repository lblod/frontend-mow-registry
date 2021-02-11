import Model, { hasMany } from '@ember-data/model';

export default class RoadSignCombinationModel extends Model {
  @hasMany('measure-concept') measureConcepts;
}
