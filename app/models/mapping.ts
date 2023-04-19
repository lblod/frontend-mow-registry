import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type TemplateModel from 'mow-registry/models/template';
import type ShapeModel from 'mow-registry/models/shape';
import type CodeListModel from './code-list';

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
