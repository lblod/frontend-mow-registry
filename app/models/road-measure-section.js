import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadMeasureSectionModel extends Model {
  @attr template;
  @belongsTo('road-measure', {inverse: "roadMeasureSections"}) roadMeasure;
  @hasMany('road-measure-variable', {inverse: "roadMeasureSection"}) variables;
}