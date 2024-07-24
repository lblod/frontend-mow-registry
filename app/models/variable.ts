import Model, { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type CodeListModel from './code-list';
import type TemplateModel from './template';
import ResourceModel from './resource';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    variable: VariableModel;
  }
}

export default class VariableModel extends ResourceModel {
  @attr declare uri: string;
  @attr declare label?: string;
  @attr declare type?: string;
  @attr declare value?: string;
  @attr declare defaultValue?: string;

  @belongsTo('code-list', { inverse: null, async: true })
  declare codeList: AsyncBelongsTo<CodeListModel>;

  @belongsTo('template', { inverse: null, async: true })
  declare instruction: AsyncBelongsTo<TemplateModel>;
}
