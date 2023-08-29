import ShapeModel from 'mow-registry/models/shape';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'node-shape': NodeShapeModel;
  }
}

export default class NodeShapeModel extends ShapeModel {}
