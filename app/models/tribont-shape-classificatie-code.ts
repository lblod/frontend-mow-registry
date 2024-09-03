import Model, { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tribont-shape-classificatie-code': TribontShapeClassificatieCodeModel;
  }
}
export default class TribontShapeClassificatieCodeModel extends Model {
  @attr declare label?: string;
}
