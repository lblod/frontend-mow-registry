import Model, { type AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type User from 'mow-registry/models/user';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Account extends Model {
  declare [Type]: 'account';
  @attr declare identifier?: string;
  @attr declare provider?: string;
  @belongsTo<User>('user', { inverse: null, async: true })
  declare user: AsyncBelongsTo<User>;
}
