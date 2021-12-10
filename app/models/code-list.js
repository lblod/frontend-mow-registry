import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class CodeListModel extends Model {
  @attr label;
  @attr uri;
  @hasMany('code-list-option', { inverse: 'codeList' }) codeListOptions;
  @hasMany('mapping', { inverse: 'codeList' }) mappings;
  @belongsTo('skos-concept') type;
}
