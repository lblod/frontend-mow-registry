import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import SkosConcept from 'mow-registry/models/skos-concept';
import type ImageModel from 'mow-registry/models/image';
import TemplateModel from './template';
import TrafficMeasureConceptModel from './traffic-measure-concept';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateHasManyOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

export default class TrafficSignConceptModel extends SkosConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-sign-concept';
  @attr declare meaning?: string;

  @belongsTo('image', { async: true, inverse: null, polymorphic: true })
  declare image: AsyncBelongsTo<ImageModel>;

  @belongsTo('skos-concept', { async: true, inverse: null })
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany('template', { async: true, inverse: null })
  declare hasInstructions: AsyncHasMany<TemplateModel>;

  @hasMany('traffic-measure-concept', {
    async: true,
    inverse: 'relatedTrafficSignConcepts',
    as: 'traffic-sign-concept',
  })
  declare hasTrafficMeasureConcepts: AsyncHasMany<TrafficMeasureConceptModel>;

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
