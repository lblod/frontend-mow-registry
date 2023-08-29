import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type CodeListModel from 'mow-registry/models/code-list';
import type ShapeModel from 'mow-registry/models/shape';
import type TemplateModel from 'mow-registry/models/template';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    mapping: MappingModel;
  }
}
export default class MappingModel extends Model {
  @attr('string') declare variable?: string;
  @attr('string') declare type?: string;
  @attr declare uri?: string;
  @belongsTo('code-list', { inverse: 'mappings', async: true })
  declare codeList: AsyncBelongsTo<CodeListModel>;
  @belongsTo('template', { inverse: null, async: true })
  declare instruction: AsyncBelongsTo<TemplateModel>;
  @belongsTo('shape', { inverse: null, async: true, polymorphic: true })
  declare expects: AsyncBelongsTo<ShapeModel>;
}
