import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class TribontShapeClassificationCodeModel extends Model {
  declare [Type]: 'tribont-shape-classification-code';
  @attr declare label?: string;
}
