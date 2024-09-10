import {
  AsyncBelongsTo,
  AsyncHasMany,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import DimensionModel from './dimension';
import TribontShapeClassificationCodeModel from './tribont-shape-classification-code';
import AbstractValidationModel from './abstract-validation-model';
import {
  validateBelongsToRequired,
  validateHasManyRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';

export default class TribontShapeModel extends AbstractValidationModel {
  declare [Type]: 'tribont-shape';
  @hasMany('dimension', { inverse: null, async: true })
  declare dimensions: AsyncHasMany<DimensionModel>;
  @belongsTo('tribont-shape-classification-code', {
    inverse: null,
    async: true,
  })
  declare classification: AsyncBelongsTo<TribontShapeClassificationCodeModel>;
  get validationSchema() {
    return Joi.object({
      dimensions: validateHasManyRequired(),
      classification: validateBelongsToRequired(),
    });
  }
}
