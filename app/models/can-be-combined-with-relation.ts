import RelationModel from 'mow-registry/models/relation';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'can-be-combined-with-relation': CanBeCombinedWithRelationModel;
  }
}

export default class CanBeCombinedWithRelationModel extends RelationModel {}
