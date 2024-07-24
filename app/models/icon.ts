import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import ImageModel from 'mow-registry/models/image';
import { validateBelongsToRequired } from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    icon: Icon;
  }
}
export default class Icon extends SkosConcept {
  @belongsTo('image', {
    async: true,
    inverse: null,
  })
  declare image: AsyncBelongsTo<ImageModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateBelongsToRequired(),
    });
  }
}
