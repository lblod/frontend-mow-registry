import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    dimension: DimensionModel;
  }
}

export default class DimensionModel extends Model {
  @attr declare unit?: string;
  @attr declare quantityKind?: string;
  @attr declare value?: number;
}
