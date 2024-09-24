import Model, { type AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type File from './file';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Document extends Model {
  declare [Type]: 'document';

  @belongsTo<File>('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<File>;
}
