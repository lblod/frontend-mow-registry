import { type AsyncBelongsTo, belongsTo } from '@warp-drive/legacy/model';
import type File from './file';
import type { Type } from '@warp-drive/core/types/symbols';
import Joi from 'joi';
import { validateBelongsToOptional } from 'mow-registry/validators/schema';
import AbstractValidationModel from './abstract-validation-model';

export default class Document extends AbstractValidationModel {
  declare [Type]: 'document';

  @belongsTo<File>('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<File>;

  get validationSchema() {
    return Joi.object({
      file: validateBelongsToOptional(),
    });
  }

  async destroyWithRelations() {
    await Promise.all([
      this.destroyRecord(),
      (await this.file)?.destroyRecord(),
    ]);

    return this;
  }
}
