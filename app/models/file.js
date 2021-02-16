import Model, { attr } from '@ember-data/model';

export default class FileModel extends Model {
  @attr name;
  @attr format;
  @attr size;
  @attr extension;
  @attr('datetime') created;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
