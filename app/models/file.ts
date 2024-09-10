import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class FileModel extends Model {
  declare [Type]: 'file';
  @attr declare name?: string;
  @attr declare format?: string;
  @attr declare size?: number;
  @attr declare extension?: string;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
