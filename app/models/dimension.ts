import { type AsyncBelongsTo, belongsTo } from '@warp-drive/legacy/model';
import { attr } from '@warp-drive/legacy/model';
import Unit from './unit';
import QuantityKind from './quantity-kind';
import AbstractValidationModel from './abstract-validation-model';
import {
  validateBelongsToRequired,
  validateNumberRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';
import type { Type } from '@warp-drive/core/types/symbols';

export default class Dimension extends AbstractValidationModel {
  declare [Type]: 'dimension';
  @attr declare value?: number;

  @belongsTo<Unit>('unit', { inverse: null, async: true })
  declare unit: AsyncBelongsTo<Unit>;

  @belongsTo<QuantityKind>('quantity-kind', { inverse: null, async: true })
  declare kind: AsyncBelongsTo<QuantityKind>;

  get validationSchema() {
    return Joi.object({
      unit: validateBelongsToRequired(),
      kind: validateBelongsToRequired(),
      value: validateNumberRequired(),
    });
  }
}
