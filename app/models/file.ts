import Model, { attr } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class File extends Model {
  declare [Type]: 'file';
  @attr declare name?: string;
  @attr declare format?: string;
  @attr declare size?: number;
  @attr declare extension?: string;

  get downloadLink() {
    return this.id ? `/files/${this.id}/download` : '';
  }
}
