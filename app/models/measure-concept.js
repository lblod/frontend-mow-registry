import Model, { attr, belongsTo } from '@ember-data/model';

export default class MeasureConceptModel extends Model {
  @attr description;
  @belongsTo('road-sign-combination', {
    inverse: 'measureConcepts',
  })
  roadSignCombination;
  @belongsTo('road-sign-concept') roadSignConcept;
}
