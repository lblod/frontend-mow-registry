import Model, { hasMany } from '@ember-data/model';
import { attr } from '@ember-data/model';
import type Unit from './unit';
import type { Type } from '@warp-drive/core-types/symbols';

export default class QuantityKind extends Model {
  declare [Type]: 'quantity-kind';
  @attr declare symbol?: string;
  @attr declare label?: string;

  @hasMany<Unit>('unit', { inverse: null, async: false })
  declare units: Unit[];
}
