import {
  type AsyncBelongsTo,
  type AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Dimension from './dimension';
import type TribontShapeClassificationCode from './tribont-shape-classification-code';
import AbstractValidationModel from './abstract-validation-model';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateHasManyRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';
import type TrafficSignalConcept from './traffic-signal-concept';

export default class TribontShape extends AbstractValidationModel {
  declare [Type]: 'tribont-shape';

  @hasMany<Dimension>('dimension', { inverse: null, async: true })
  declare dimensions: AsyncHasMany<Dimension>;
  @attr('date') declare createdOn?: Date;

  @belongsTo<TribontShapeClassificationCode>(
    'tribont-shape-classification-code',
    {
      inverse: null,
      async: true,
    },
  )
  declare classification: AsyncBelongsTo<TribontShapeClassificationCode>;

  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    inverse: 'shapes',
    async: true,
    polymorphic: true,
  })
  declare trafficSignalConcept: AsyncBelongsTo<TrafficSignalConcept>;

  get validationSchema() {
    return Joi.object({
      dimensions: validateHasManyRequired(),
      classification: validateBelongsToRequired(),
      trafficSignalConcept: validateBelongsToOptional(),
    });
  }

  async destroyWithRelations() {
    const dimensions = await this.dimensions;

    await Promise.all([
      this.destroyRecord(),
      ...dimensions.map((dimension) => dimension.destroyRecord()),
    ]);

    return this;
  }
}
