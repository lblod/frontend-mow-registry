import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import { attr } from '@ember-data/model';
import UnitModel from './unit';
import type { Type } from '@warp-drive/core-types/symbols';

export default class QuantityKindModel extends Model {
  declare [Type]: 'quantity-kind';
  @attr declare symbol?: string;
  @attr declare label?: string;
  @hasMany('unit', { inverse: null, async: false })
  declare units: AsyncHasMany<UnitModel>;
}
