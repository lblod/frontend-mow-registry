import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type UserModel from 'mow-registry/models/user';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    account: AccountModel;
  }
}

export default class AccountModel extends Model {
  @attr() declare identifier?: string;
  @attr() declare provider?: string;
  @belongsTo('user', { inverse: null, async: true })
  declare user: AsyncBelongsTo<UserModel>;
}
