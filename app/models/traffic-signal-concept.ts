import {
  attr,
  hasMany,
  belongsTo,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';
import SkosConcept from 'mow-registry/models/skos-concept';
import type Image from 'mow-registry/models/image';
import type Template from './template';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateBooleanOptional,
  validateHasManyOptional,
  validateStringRequired,
  validateDateOptional,
  validateEndDate,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import type TribontShape from './tribont-shape';
import type Variable from './variable';
import TrafficSignalListItem from './traffic-signal-list-item';
import { query } from '@warp-drive/legacy/compat/builders';
import Joi from 'joi';
import AbstractValidationModel from './abstract-validation-model';

export default class TrafficSignalConcept extends AbstractValidationModel {
  declare [Type]: 'traffic-signal-concept';

  @attr declare uri?: string;
  @attr declare label?: string;
  @attr declare meaning?: string;
  @attr declare valid?: boolean;
  @attr declare arPlichtig?: boolean;
  @attr declare regulatoryNotation?: string;
  @attr('date') declare startDate?: Date;
  @attr('date') declare endDate?: Date;

  @hasMany<Variable>('variable', {
    async: true,
    polymorphic: true,
    inverse: 'trafficSignalConcept',
    as: 'traffic-signal-concept',
  })
  declare variables: AsyncHasMany<Variable>;

  @belongsTo<Image>('image', { async: true, inverse: null, polymorphic: true })
  declare image: AsyncBelongsTo<Image>;

  @belongsTo<SkosConcept>('skos-concept', { async: true, inverse: null })
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany<Template>('template', {
    async: true,
    inverse: null,
  })
  declare hasInstructions: AsyncHasMany<Template>;

  @hasMany<TribontShape>('tribont-shape', {
    inverse: 'trafficSignalConcept',
    as: 'traffic-signal-concept',
    async: true,
  })
  declare shapes: AsyncHasMany<TribontShape>;

  @belongsTo<TribontShape>('tribont-shape', { inverse: null, async: true })
  declare defaultShape: AsyncBelongsTo<TribontShape>;

  get validationSchema() {
    return Joi.object({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      shapes: validateHasManyOptional(),
      defaultShape: validateBelongsToOptional(),
      valid: validateBooleanOptional(),
      arPlichtig: validateBooleanOptional(),
      regulatoryNotation: validateStringOptional(),
      startDate: validateDateOptional(),
      endDate: validateEndDate(),
      image: validateBelongsToRequired(),
      meaning: validateStringRequired(),
      status: validateBelongsToOptional(),
      hasInstructions: validateHasManyOptional(),
      variables: validateHasManyOptional(),
    });
  }

  async destroyWithRelations() {
    // This doesn't delete the status or hasTrafficMeasureConcepts relations as it wasn't clear what
    // the expectation would be for these since they don't appear to be used
    if (this.uri) {
      const trafficListItems = await this.store
        .request(
          query<TrafficSignalListItem>('traffic-signal-list-item', {
            filter: {
              item: {
                ':uri:': this.uri,
              },
            },
          }),
        )
        .then((res) => res.content);
      await Promise.all(trafficListItems.map((item) => item.destroyRecord()));
    }

    const [variables, image, instructions, shapes] = await Promise.all([
      this.variables,
      this.image,
      this.hasInstructions,
      this.shapes,
    ]);

    await Promise.all([
      this.destroyRecord(),
      ...variables.map((variable) => variable.destroyRecord()),
      image?.destroyWithRelations(),
      ...instructions.map((instruction) => instruction.destroyWithRelations()),
      ...shapes.map((shape) => shape.destroyWithRelations()),
    ]);

    return this;
  }
}
