import RelationModel from 'mow-registry/models/relation';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'must-use-relation': MustUseRelationModel;
  }
}

export default class MustUseRelationModel extends RelationModel {}
