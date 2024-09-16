import Joi from 'joi';
import AbstractValidationModel from './abstract-validation-model';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Resource extends AbstractValidationModel {
  declare [Type]: 'resource';

  get validationSchema() {
    return Joi.object({
      used: validateHasManyOptional(),
    });
  }
}
