import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadsigncategoryModel extends Model {
  @attr label;
  @hasMany('roadsignconcept', {
    inverse: 'categories',
  })
  roadsignconcepts;
}
