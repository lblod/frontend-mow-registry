import Model, { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type CodeListModel from './code-list';
import type TemplateModel from './template';
import type ResourceModel from './resource';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    variable: VariableModel;
  }
}

export default class VariableModel extends Model {
  @attr declare uri: string;
  @attr declare label?: string;
  @attr declare type?: string;

  @belongsTo('resource', { inverse: null, async: true })
  declare defaultValue: AsyncBelongsTo<ResourceModel>;

  @belongsTo('code-list', { inverse: null, async: true })
  declare codeList: AsyncBelongsTo<CodeListModel>;

  @belongsTo('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<TemplateModel>;

  @belongsTo('resource', { inverse: null, async: true })
  declare value: AsyncBelongsTo<ResourceModel>;
}
