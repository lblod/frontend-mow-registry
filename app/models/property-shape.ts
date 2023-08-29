import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type ResourceModel from 'mow-registry/models/resource';
import ShapeModel from 'mow-registry/models/shape';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'property-shape': PropertyShapeModel;
  }
}

export default class PropertyShapeModel extends ShapeModel {
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare path: AsyncBelongsTo<ResourceModel>;
}
