import { type AsyncHasMany, hasMany } from '@ember-data/model';
import Joi from 'joi';
import AbstractValidationModel from './abstract-validation-model';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type Concept from 'mow-registry/models/concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Resource extends AbstractValidationModel {
  declare [Type]: 'resource';

  @hasMany<Concept>('concept', { inverse: null, async: true })
  declare used: AsyncHasMany<Concept>;

  get validationSchema() {
    return Joi.object({
      used: validateHasManyOptional(),
    });
  }
}
