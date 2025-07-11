import AbstractValidationModel from './abstract-validation-model';
import { type AsyncHasMany, attr, hasMany } from '@warp-drive/legacy/model';
import Joi from 'joi';
import type SkosConcept from 'mow-registry/models/skos-concept';
import {
  validateHasManyOptional,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core/types/symbols';

export default class ConceptScheme extends AbstractValidationModel {
  declare [Type]: 'concept-scheme';
  @attr declare label?: string;
  @hasMany<SkosConcept>('skos-concept', {
    inverse: 'inScheme',
    async: true,
    polymorphic: true,
    as: 'concept-scheme',
  })
  declare concepts: AsyncHasMany<SkosConcept>;

  get validationSchema() {
    return Joi.object({
      label: validateStringOptional(),
      concepts: validateHasManyOptional(),
    });
  }
}
