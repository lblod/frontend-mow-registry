import Model, { attr } from '@ember-data/model';

export default class File extends Model {
  @attr uri;
  @attr filename;
  @attr format;
  @attr size;
  @attr('string', { defaultValue: 'n/a' }) extension;
  @attr('datetime') created;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
