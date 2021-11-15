import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class CodeListOptionModel extends Model {
  @attr label;
  @belongsTo('code-list', {inverse: 'codeListOptions'}) codeList;
}
