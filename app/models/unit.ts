import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    unit: UnitModel;
  }
}

export default class UnitModel extends Model {
  @attr declare symbol?: string;
  @attr declare label?: string;
}
