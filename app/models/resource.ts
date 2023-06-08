import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import type ConceptModel from 'mow-registry/models/concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    resource: ResourceModel;
  }
}

export default class ResourceModel extends Model {
  @hasMany('concept', { inverse: null, async: true })
  declare used: AsyncHasMany<ConceptModel>;
}
