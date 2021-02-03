import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadsignconceptStatusCodeModel extends Model {
  @attr label;
  @hasMany('roadsignconcept') roadsignconcepts;
}
