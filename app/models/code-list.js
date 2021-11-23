import Model, { attr, hasMany } from '@ember-data/model';

export default class CodeListModel extends Model {
  @attr label;
  @hasMany('code-list-option', { inverse: 'codeList' }) codeListOptions;
  @hasMany('mapping', { inverse: 'codeList' }) mappings;

  get readableLabel() {
    return this.label
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  }
}
