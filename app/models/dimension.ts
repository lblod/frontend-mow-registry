import Model, { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import { attr } from '@ember-data/model';
import UnitModel from './unit';
import QuantityKindModel from './quantity-kind';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    dimension: DimensionModel;
  }
}

export default class DimensionModel extends Model {
  @attr declare value?: number;

  @belongsTo('unit', { inverse: null, async: true })
  declare unit: AsyncBelongsTo<UnitModel>;

  @belongsTo('quantity-kind', { inverse: null, async: true })
  declare quantityKind: AsyncBelongsTo<QuantityKindModel>;
}
