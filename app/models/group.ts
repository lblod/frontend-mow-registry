import Model, { attr } from '@ember-data/model';
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    group: GroupModel;
  }
}
export default class GroupModel extends Model {
  @attr declare name?: string;
}
