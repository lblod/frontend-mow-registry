import { get } from '@ember/object';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type AccountModel from 'mow-registry/models/account';
import type GroupModel from 'mow-registry/models/group';

export default class UserModel extends Model {
  declare [Type]: 'user';
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
