import Model from '@ember-data/model';
import { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class UnitModel extends Model {
  declare [Type]: 'unit';
  @attr declare symbol?: string;
  @attr declare label?: string;
}
