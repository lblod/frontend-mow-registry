import { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type CodeListModel from './code-list';
import type TemplateModel from './template';
import ResourceModel from './resource';

export default class VariableModel extends ResourceModel {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'variable';
  @attr declare uri: string;
  @attr declare label?: string;
  @attr declare type?: string;
  @attr declare value?: string;
  @attr declare defaultValue?: string;

  @belongsTo('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeListModel>;

  @belongsTo('template', { inverse: null, async: true })
  declare instruction: AsyncBelongsTo<TemplateModel>;
}
