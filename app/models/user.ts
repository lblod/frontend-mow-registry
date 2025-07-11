import { get } from '@ember/object';
import Model, { type AsyncHasMany, attr, hasMany } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Account from 'mow-registry/models/account';
import type Group from 'mow-registry/models/group';

export default class User extends Model {
  declare [Type]: 'user';
  @attr declare firstName?: string;
  @attr declare familyName?: string;

  @hasMany<Account>('account', { inverse: null, async: true })
  declare accounts: AsyncHasMany<Account>;

  @hasMany<Group>('group', { inverse: null, async: true })
  declare groups: AsyncHasMany<Group>;

  get group() {
    return get(this, 'groups.firstObject'); // eslint-disable-line ember/no-get
  }

  get fullName() {
    return `${this.firstName ?? ''} ${this.familyName ?? ''}`.trim();
  }
}
