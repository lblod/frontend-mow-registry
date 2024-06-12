import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import { attr } from '@ember-data/model';
import DimensionModel from './dimension';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tribont-shape': TribontShapeModel;
  }
}

export default class TribontShapeModel extends Model {
  @attr declare label?: string;

  @hasMany('dimension', { inverse: null, async: true })
  declare hasDimension?: AsyncHasMany<DimensionModel>;
}
