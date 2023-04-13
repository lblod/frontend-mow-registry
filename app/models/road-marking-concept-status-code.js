import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadMarkingConceptStatusCodeModel extends Model {
  @attr label;
  @hasMany('road-marking-concept', { inverse: 'status', async: true })
  roadMarkingConcepts;
}
