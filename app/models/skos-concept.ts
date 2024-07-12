import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import Joi from 'joi';
import type ConceptScheme from 'mow-registry/models/concept-scheme';
import {
  validateBelongsToOptional,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import AbstractValidationModel from './abstract-validation-model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'skos-concept': SkosConcept;
  }
}
export default class SkosConcept extends AbstractValidationModel {
  @attr declare uri?: string;
  @attr declare label?: string;
  @belongsTo('concept-scheme', {
    inverse: 'concepts',
    polymorphic: true,
    async: true,
  })
  declare inScheme: AsyncBelongsTo<ConceptScheme>;
  get validationSchema() {
    return Joi.object({
      uri: validateStringOptional(),
      label: validateStringOptional(),
      inScheme: validateBelongsToOptional(),
    });
  }
}
