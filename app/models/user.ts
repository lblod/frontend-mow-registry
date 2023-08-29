import { get } from '@ember/object';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type AccountModel from 'mow-registry/models/account';
import type GroupModel from 'mow-registry/models/group';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: UserModel;
  }
}

export default class UserModel extends Model {
  @attr() declare firstName?: string;
  @attr() declare familyName?: string;

  @hasMany('account', { inverse: null, async: true })
  declare accounts: AsyncHasMany<AccountModel>;

  @hasMany('group', { inverse: null, async: true })
  declare groups: AsyncHasMany<GroupModel>;

  get group() {
    return get(this, 'groups.firstObject'); // eslint-disable-line ember/no-get
  }

  get fullName() {
    return `${this.firstName ?? ''} ${this.familyName ?? ''}`.trim();
  }
}
