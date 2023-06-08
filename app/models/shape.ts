import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type ResourceModel from 'mow-registry/models/resource';
import type ConceptModel from 'mow-registry/models/concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    shape: ShapeModel;
  }
}
export default class ShapeModel extends Model {
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare targetClass: AsyncBelongsTo<ResourceModel>;
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare targetNode: AsyncBelongsTo<ResourceModel>;
  @belongsTo('concept', { inverse: null, async: true, polymorphic: true })
  declare targetHasConcept: AsyncBelongsTo<ConceptModel>;
}
