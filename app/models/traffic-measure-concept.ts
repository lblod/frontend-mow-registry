import {
  type AsyncBelongsTo,
  type AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficSignConcept from './traffic-sign-concept';
import type Template from './template';
import Joi from 'joi';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateBooleanOptional,
  validateHasManyOptional,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import AbstractValidationModel from './abstract-validation-model';

export default class TrafficMeasureConcept extends AbstractValidationModel {
  declare [Type]: 'traffic-measure-concept';
  @attr declare label?: string;
  @attr declare variableSignage?: boolean;
  @attr declare valid?: boolean;

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany<TrafficSignConcept>('traffic-sign-concept', {
    inverse: 'hasTrafficMeasureConcepts',
    async: true,
    polymorphic: true,
  })
  declare relatedTrafficSignConcepts: AsyncHasMany<TrafficSignConcept>;

  @belongsTo<Template>('template', { async: true, inverse: 'parentConcept' })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return Joi.object({
      label: validateStringOptional(),
      variableSignage: validateBooleanOptional(),
      valid: validateBooleanOptional(),
      zonality: validateBelongsToRequired(),
      relatedTrafficSignConcepts: validateHasManyOptional(),
      template: validateBelongsToOptional(),
    });
  }
}
