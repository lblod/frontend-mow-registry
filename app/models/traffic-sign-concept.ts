import {
  attr,
  hasMany,
  belongsTo,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import SkosConcept from 'mow-registry/models/skos-concept';
import type Image from 'mow-registry/models/image';
import type Template from './template';
import type TrafficMeasureConcept from './traffic-measure-concept';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateBooleanOptional,
  validateHasManyOptional,
  validateStringRequired,
  validateDateOptional,
  validateEndDate,
} from 'mow-registry/validators/schema';
import type TribontShape from './tribont-shape';

export default class TrafficSignConcept extends SkosConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-sign-concept';
  @attr declare meaning?: string;
  @attr declare valid?: boolean;
  @attr declare arPlichtig?: boolean;
  @attr('date') declare startDate?: Date;
  @attr('date') declare endDate?: Date;

  @belongsTo<Image>('image', { async: true, inverse: null, polymorphic: true })
  declare image: AsyncBelongsTo<Image>;

  @belongsTo<SkosConcept>('skos-concept', { async: true, inverse: null })
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany<Template>('template', {
    async: true,
    inverse: null,
  })
  declare hasInstructions: AsyncHasMany<Template>;

  @hasMany('tribont-shape', { inverse: null, async: true })
  declare shapes: AsyncHasMany<TribontShape>;

  @hasMany<TrafficMeasureConcept>('traffic-measure-concept', {
    async: true,
    inverse: 'relatedTrafficSignConcepts',
    as: 'traffic-sign-concept',
  })
  declare hasTrafficMeasureConcepts: AsyncHasMany<TrafficMeasureConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      shapes: validateHasManyOptional(),
      valid: validateBooleanOptional(),
      arPlichtig: validateBooleanOptional(),
      startDate: validateDateOptional(),
      endDate: validateEndDate(),
      image: validateBelongsToRequired(),
      meaning: validateStringRequired(),
      status: validateBelongsToOptional(),
      hasInstructions: validateHasManyOptional(),
      hasTrafficMeasureConcepts: validateHasManyOptional(),
    });
  }
}
