import Model, { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tribont-shape-classification-code': TribontShapeClassificationCodeModel;
  }
}
export default class TribontShapeClassificationCodeModel extends Model {
  @attr declare label?: string;
}
