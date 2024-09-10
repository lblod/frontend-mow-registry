import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type Resource from 'mow-registry/models/resource';
import type Concept from 'mow-registry/models/concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class ShapeModel extends Model {
  declare [Type]: 'shape';

  @belongsTo<Resource>('resource', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare targetClass: AsyncBelongsTo<Resource>;
  @belongsTo<Resource>('resource', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare targetNode: AsyncBelongsTo<Resource>;
  @belongsTo<Concept>('concept', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare targetHasConcept: AsyncBelongsTo<Concept>;
}
