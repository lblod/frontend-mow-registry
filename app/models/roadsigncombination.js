import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadsigncombinationModel extends Model {
  @attr identifier;
  @hasMany('measureconcept') measureconcepts;
}
