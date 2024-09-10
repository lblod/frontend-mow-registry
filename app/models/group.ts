import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class GroupModel extends Model {
  declare [Type]: 'group';
  @attr declare name?: string;
}
