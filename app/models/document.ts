import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import FileModel from './file';
import type { Type } from '@warp-drive/core-types/symbols';

export default class DocumentModel extends Model {
  declare [Type]: 'document';

  @belongsTo('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<FileModel>;
}
