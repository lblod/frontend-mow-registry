import Model, { attr, belongsTo } from '@ember-data/model';

export default class MappingModel extends Model {
  @attr('string') variable;
  @attr('string') type;
  @belongsTo('code-list', { inverse: 'mappings' }) codeList;
  @belongsTo('template', { inverse: null }) instruction;
  @belongsTo('shape', { polyMorphic: true }) expects;
}
