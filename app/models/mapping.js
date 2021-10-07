import Model, { attr, belongsTo } from '@ember-data/model';

export default class MappingModel extends Model {
  @attr('string') variable;
  @belongsTo('shape', { polyMorphic: true }) expects;
}
