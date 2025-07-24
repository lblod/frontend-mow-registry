import {
  type AsyncBelongsTo,
  type AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficSignalListItem from './traffic-signal-list-item';
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
import type TrafficSignalConcept from './traffic-signal-concept';

export default class TrafficMeasureConcept extends AbstractValidationModel {
  declare [Type]: 'traffic-measure-concept';
  @attr declare label?: string;
  @attr declare variableSignage?: boolean;
  @attr declare valid?: boolean;
  @attr('date') declare startDate?: Date;
  @attr('date') declare endDate?: Date;

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany<TrafficSignalListItem>('traffic-signal-list-item', {
    async: true,
    polymorphic: true,
    inverse: null,
  })
  declare relatedTrafficSignalConceptsOrdered: AsyncHasMany<TrafficSignalListItem>;

  @hasMany<TrafficSignalConcept>('traffic-signal-concept', {
    async: true,
    polymorphic: true,
    inverse: 'hasTrafficMeasureConcepts',
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
      relatedTrafficSignalConceptsOrdered: validateHasManyOptional(),
      relatedTrafficSignalConcepts: validateHasManyOptional(),
      template: validateBelongsToOptional(),
      startDate: validateDateOptional(),
      endDate: validateEndDate(),
    });
  }
}
