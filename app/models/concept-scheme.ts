import AbstractValidationModel from './abstract-validation-model';
import { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import Joi from 'joi';
import type SkosConcept from 'mow-registry/models/skos-concept';
import {
  validateHasManyOptional,
  validateStringOptional,
} from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'concept-scheme': ConceptScheme;
  }
}

export default class ConceptScheme extends AbstractValidationModel {
  @attr declare label?: string;
  @hasMany('skos-concept', {
    inverse: 'inScheme',
    async: true,
    polymorphic: true,
  })
  declare concepts: AsyncHasMany<SkosConcept>;

  get validationSchema() {
    return Joi.object({
      label: validateStringOptional(),
      concepts: validateHasManyOptional(),
    });
  }
}
