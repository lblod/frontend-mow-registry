import Model, { attr, hasMany } from '@ember-data/model';

export default class MeasureConceptModel extends Model {
  @attr description;
  @hasMany('road-sign-combination', {
    inverse: 'measureConcepts',
  })
  roadSignCombinations;
}
