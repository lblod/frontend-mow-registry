import { belongsTo } from '@ember-data/model';
import ShapeModel from './shape';

export default class PropertyShapeModel extends ShapeModel {
  @belongsTo('resource', { inverse: null, async: true, polyMorphic: true })
  path;
}
