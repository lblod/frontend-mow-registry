import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import { attr } from '@ember-data/model';
import UnitModel from './unit';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'quantity-kind': QuantityKindModel;
  }
}

export default class QuantityKindModel extends Model {
  @attr declare symbol?: string;
  @attr declare label?: string;
  @hasMany('unit', { inverse: null, async: true })
  declare applicableUnits: AsyncHasMany<UnitModel>;
}
