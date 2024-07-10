import { AsyncHasMany, hasMany } from '@ember-data/model';
import Joi from 'joi';
import AbstractValidationModel from './abstract-validation-model';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type ConceptModel from 'mow-registry/models/concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    resource: ResourceModel;
  }
}

export default class ResourceModel extends AbstractValidationModel {
  @hasMany('concept', { inverse: null, async: true })
  declare used: AsyncHasMany<ConceptModel>;

  get validationSchema() {
    return Joi.object({
      used: validateHasManyOptional(),
    });
  }
}
