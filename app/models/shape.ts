import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type ResourceModel from 'mow-registry/models/resource';
import type ConceptModel from 'mow-registry/models/concept';
import type { Type } from '@warp-drive/core-types/symbols';

export default class ShapeModel extends Model {
  declare [Type]: 'shape';

  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare targetClass: AsyncBelongsTo<ResourceModel>;
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare targetNode: AsyncBelongsTo<ResourceModel>;
  @belongsTo('concept', { inverse: null, async: true, polymorphic: true })
  declare targetHasConcept: AsyncBelongsTo<ConceptModel>;
}
