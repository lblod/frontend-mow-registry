import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import type ResourceModel from 'mow-registry/models/resource';
import ShapeModel from './shape';

export default class PropertyShapeModel extends ShapeModel {
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  declare path: AsyncBelongsTo<ResourceModel>;
}
