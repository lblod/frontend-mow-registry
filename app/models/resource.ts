import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import TrafficSignConceptModel from './traffic-sign-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    resource: ResourceModel;
  }
}

export default class ResourceModel extends Model {
  @hasMany('traffic-sign-concept', { inverse: null, async: true })
  declare used: AsyncHasMany<TrafficSignConceptModel>;
}
