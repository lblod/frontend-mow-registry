import { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type CodeList from './code-list';
import type Template from './template';
import Resource from './resource';

export default class Variable extends Resource {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'variable';
  @attr declare uri: string;
  @attr declare label?: string;
  @attr declare type?: string;
  @attr declare value?: string;
  @attr declare defaultValue?: string;

  @belongsTo<CodeList>('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeList>;

  @belongsTo<Template>('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<Template>;
}
