import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import { attr } from '@ember-data/model';
import UnitModel from './unit';
import QuantityKindModel from './quantity-kind';
import AbstractValidationModel from './abstract-validation-model';
import {
  validateBelongsToRequired,
  validateNumberRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    dimension: DimensionModel;
  }
}

export default class DimensionModel extends AbstractValidationModel {
  @attr declare value?: number;

  @belongsTo('unit', { inverse: null, async: true })
  declare unit: AsyncBelongsTo<UnitModel>;

  @belongsTo('quantity-kind', { inverse: null, async: true })
  declare kind: AsyncBelongsTo<QuantityKindModel>;

  get validationSchema() {
    return Joi.object({
      unit: validateBelongsToRequired(),
      kind: validateBelongsToRequired(),
      value: validateNumberRequired(),
    });
  }
}
