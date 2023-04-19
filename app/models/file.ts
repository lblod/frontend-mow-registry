import Model, { attr } from '@ember-data/model';

export default class FileModel extends Model {
  @attr declare name?: string;
  @attr declare format?: string;
  @attr declare size?: number;
  @attr declare extension?: string;
  @attr('date') declare created?: Date;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
