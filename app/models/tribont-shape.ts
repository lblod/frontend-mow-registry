import {
  AsyncBelongsTo,
  AsyncHasMany,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Dimension from './dimension';
import type TribontShapeClassificationCode from './tribont-shape-classification-code';
import AbstractValidationModel from './abstract-validation-model';
import {
  validateBelongsToRequired,
  validateHasManyRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';

export default class TribontShapeModel extends AbstractValidationModel {
  declare [Type]: 'tribont-shape';

  @hasMany<Dimension>('dimension', { inverse: null, async: true })
  declare dimensions: AsyncHasMany<Dimension>;

  @belongsTo<TribontShapeClassificationCode>(
    'tribont-shape-classification-code',
    {
      inverse: null,
      async: true,
    },
  )
  declare classification: AsyncBelongsTo<TribontShapeClassificationCode>;

  get validationSchema() {
    return Joi.object({
      dimensions: validateHasManyRequired(),
      classification: validateBelongsToRequired(),
    });
  }
}
