import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadSignConceptStatusCodeModel extends Model {
  @attr label;
  @hasMany('road-sign-concept', { inverse: null, async: true })
  roadSignConcepts;
}
