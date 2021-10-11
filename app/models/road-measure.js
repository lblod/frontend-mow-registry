import Model, { attr, hasMany } from '@ember-data/model';

export default class RoadMeasureModel extends Model {
  @attr label;
  @hasMany('road-sign-concept', { inverse: 'measures' }) roadSignConcepts;
  @hasMany('road-measure-section', { inverse: 'roadMeasure' })
  roadMeasureSections;
}
