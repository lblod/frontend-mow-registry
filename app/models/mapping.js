import Model, { attr, belongsTo } from '@ember-data/model';

export default class MappingModel extends Model {
  @attr('string') variable;
  @attr('string') type;
  @attr uri;
  @belongsTo('code-list', { inverse: 'mappings', async: true }) codeList;
  @belongsTo('template', { inverse: null, async: true }) instruction;
  @belongsTo('shape', { inverse: null, async: true, polymorphic: true })
  expects;
}
