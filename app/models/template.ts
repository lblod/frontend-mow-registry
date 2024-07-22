import {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import type MappingModel from 'mow-registry/models/mapping';
import TrafficMeasureConceptModel from './traffic-measure-concept';
import DocumentModel from './document';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    template: TemplateModel;
  }
}
export default class TemplateModel extends DocumentModel {
  @attr('string') declare value?: string;
  @attr('string') declare annotated?: string;

  @hasMany('mapping', { inverse: null, async: true })
  declare mappings: AsyncHasMany<MappingModel>;

  @belongsTo('traffic-measure-concept', {
    inverse: 'template',
    async: true,
  })
  declare parentConcept: AsyncBelongsTo<TrafficMeasureConceptModel>;
}
