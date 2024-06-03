import Model, { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import FileModel from './file';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    document: DocumentModel;
  }
}

export default class DocumentModel extends Model {
  // @attr declare uri?: string;

  @belongsTo('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<FileModel>;
}
