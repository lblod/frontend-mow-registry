import Model, { attr, hasMany } from '@ember-data/model';

export default class MeasureconceptModel extends Model {
  @attr description;
  @hasMany('roadsigncombination', {
    inverse: 'measureconcepts',
  })
  roadsigncombinations;
}
