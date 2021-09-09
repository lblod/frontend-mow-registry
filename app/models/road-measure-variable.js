import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RoadMeasureVariableModel extends Model {
  @attr label;
  @attr type;
  @belongsTo('road-measure-section', {inverse: 'variables'}) roadMeasureSection;
}
