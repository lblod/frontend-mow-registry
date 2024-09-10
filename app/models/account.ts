import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type UserModel from 'mow-registry/models/user';
import type { Type } from '@warp-drive/core-types/symbols';

export default class AccountModel extends Model {
  declare [Type]: 'account';
  @attr() declare identifier?: string;
  @attr() declare provider?: string;
  @belongsTo('user', { inverse: null, async: true })
  declare user: AsyncBelongsTo<UserModel>;
}
