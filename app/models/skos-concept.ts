import { type AsyncBelongsTo, attr, hasMany } from '@warp-drive/legacy/model';
import Joi from 'joi';
import type ConceptScheme from 'mow-registry/models/concept-scheme';
import {
  validateHasManyOptional,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';
import AbstractValidationModel from './abstract-validation-model';
import type { Type } from '@warp-drive/core/types/symbols';
import type ConceptLabelChangeNote from './concept-label-change-note';

export default class SkosConcept extends AbstractValidationModel {
  declare [Type]: 'skos-concept';
  @attr declare uri?: string;
  @attr declare label?: string;

  @hasMany<ConceptScheme>('concept-scheme', {
    inverse: 'concepts',
    polymorphic: true,
    as: 'skos-concept',
    async: true,
  })
  declare inScheme: AsyncBelongsTo<ConceptScheme>;

  @hasMany<ConceptLabelChangeNote>('concept-label-change-note', {
    inverse: 'concept',
    as: 'skos-concept',
    async: true,
  })
  declare historyNotes: AsyncBelongsTo<ConceptLabelChangeNote>;

  get validationSchema() {
    return Joi.object({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      inScheme: validateHasManyOptional(),
    });
  }
}
