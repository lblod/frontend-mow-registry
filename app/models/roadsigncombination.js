import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadsigncombinationModel extends Model {
  @attr identifier;
  @hasMany('measureconcept') measureconcepts;
  @belongsTo('roadsignconcept') roadsignconcept;
}
