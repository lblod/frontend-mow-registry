import {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import TrafficMeasureConceptModel from './traffic-measure-concept';
import DocumentModel from './document';
import VariableModel from './variable';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    template: TemplateModel;
  }
}
export default class TemplateModel extends DocumentModel {
  @attr declare value?: string;

  @hasMany('variable', { inverse: null, async: true })
  declare variables: AsyncHasMany<VariableModel>;

  @belongsTo('traffic-measure-concept', {
    inverse: 'template',
    async: true,
  })
  declare parentConcept: AsyncBelongsTo<TrafficMeasureConceptModel>;
}
