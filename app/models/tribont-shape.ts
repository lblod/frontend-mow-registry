import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import DimensionModel from './dimension';
import TribontShapeClassificatieCodeModel from './tribont-shape-classificatie-code';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tribont-shape': TribontShapeModel;
  }
}

export default class TribontShapeModel extends Model {
  @hasMany('dimension', { inverse: null, async: true })
  declare dimensions: AsyncHasMany<DimensionModel>;
  @belongsTo('tribont-shape-classificatie-code', { inverse: null, async: true })
  declare classification: AsyncBelongsTo<TribontShapeClassificatieCodeModel>;
}
