import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class MeasureConceptModel extends Model {
  @attr description;
  @hasMany('road-sign-combination', {
    inverse: 'measureConcepts',
  })
  roadSignCombinations;
  @belongsTo('road-sign-concept') roadSignConcept;
}
