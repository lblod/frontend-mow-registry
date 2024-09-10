import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type Resource from 'mow-registry/models/resource';
import Shape from 'mow-registry/models/shape';
import type { Type } from '@warp-drive/core-types/symbols';

export default class PropertyShape extends Shape {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'property-shape';
  @belongsTo<Resource>('resource', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare path: AsyncBelongsTo<Resource>;
}
