import Model, { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    file: FileModel;
  }
}
export default class FileModel extends Model {
  @attr declare name?: string;
  @attr declare format?: string;
  @attr declare size?: number;
  @attr declare extension?: string;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
