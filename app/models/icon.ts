import { type AsyncBelongsTo, belongsTo } from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import type Image from 'mow-registry/models/image';
import { validateBelongsToRequired } from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Icon extends SkosConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'icon';

  @belongsTo<Image>('image', {
    async: true,
    inverse: null,
  })
  declare image: AsyncBelongsTo<Image>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateBelongsToRequired(),
    });
  }
}
