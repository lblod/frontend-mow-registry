import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import SkosConcept from 'mow-registry/models/skos-concept';
import type Image from 'mow-registry/models/image';
import type Template from './template';
import type TrafficMeasureConcept from './traffic-measure-concept';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateHasManyOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

export default class TrafficSignConcept extends SkosConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-sign-concept';
  @attr declare meaning?: string;
  @attr declare valid?: boolean;

  @belongsTo<Image>('image', { async: true, inverse: null, polymorphic: true })
  declare image: AsyncBelongsTo<Image>;

  @belongsTo<SkosConcept>('skos-concept', { async: true, inverse: null })
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany<Template>('template', { async: true, inverse: null })
  declare hasInstructions: AsyncHasMany<Template>;

  @hasMany<TrafficMeasureConcept>('traffic-measure-concept', {
    async: true,
    inverse: 'relatedTrafficSignConcepts',
    as: 'traffic-sign-concept',
  })
  declare hasTrafficMeasureConcepts: AsyncHasMany<TrafficMeasureConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateBelongsToRequired(),
      meaning: validateStringRequired(),
      status: validateBelongsToOptional(),
      hasInstructions: validateHasManyOptional(),
      hasTrafficMeasureConcepts: validateHasManyOptional(),
    });
  }
}