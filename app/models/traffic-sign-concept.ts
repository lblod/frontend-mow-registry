import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import type ImageModel from 'mow-registry/models/image';
import TemplateModel from './template';
import TrafficMeasureConceptModel from './traffic-measure-concept';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateHasManyOptional,
  validateHasManyRequired,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'traffic-sign-concept': TrafficSignConceptModel;
  }
}

export default class TrafficSignConceptModel extends SkosConcept {
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
  })
  declare hasTrafficMeasureConcepts: AsyncHasMany<TrafficMeasureConceptModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateBelongsToOptional(),
      meaning: validateStringRequired(),
      label: validateStringOptional(),
      status: validateBelongsToOptional(),
      hasInstructions: validateHasManyOptional(),
      hasTrafficMeasureConcepts: validateHasManyOptional(),
    });
  }
}
