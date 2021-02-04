import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class MeasureconceptModel extends Model {
  @attr description;
  @hasMany('roadsigncombination', {
    inverse: 'measureconcepts',
  })
  roadsigncombinations;
  @belongsTo('roadsignconcept') roadsignconcept;
}
