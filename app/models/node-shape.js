import { attr } from '@ember-data/model';
import ShapeModel from './shape';

export default class NodeShapeModel extends ShapeModel {
  @attr label;
}
