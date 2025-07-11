import {
  type AsyncBelongsTo,
  type AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficSignalConcept from './traffic-signal-concept';
import type Template from './template';
import Joi from 'joi';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateBooleanOptional,
  validateHasManyOptional,
  validateStringOptional,
  validateDateOptional,
  validateEndDate,
} from 'mow-registry/validators/schema';
import AbstractValidationModel from './abstract-validation-model';

export default class TrafficMeasureConcept extends AbstractValidationModel {
  declare [Type]: 'traffic-measure-concept';
  @attr declare label?: string;
  @attr declare variableSignage?: boolean;
  @attr declare valid?: boolean;
  @attr('date') declare startDate?: Date;
  @attr('date') declare endDate?: Date;

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany<TrafficSignalConcept>('traffic-signal-concept', {
    inverse: 'hasTrafficMeasureConcepts',
    async: true,
    polymorphic: true,
  })
  declare relatedTrafficSignalConcepts: AsyncHasMany<TrafficSignalConcept>;

  @belongsTo<Template>('template', { async: true, inverse: 'parentConcept' })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return Joi.object({
      label: validateStringOptional(),
      variableSignage: validateBooleanOptional(),
      valid: validateBooleanOptional(),
      zonality: validateBelongsToRequired(),
      relatedTrafficSignalConcepts: validateHasManyOptional(),
      template: validateBelongsToOptional(),
      startDate: validateDateOptional(),
      endDate: validateEndDate(),
    });
  }
}
