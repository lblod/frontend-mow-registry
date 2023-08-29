import Model, {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type MappingModel from 'mow-registry/models/mapping';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    template: TemplateModel;
  }
}
export default class TemplateModel extends Model {
  @attr('string') declare value?: string;
  @attr('string') declare annotated?: string;
  @hasMany('mapping', { inverse: null, async: true })
  declare mappings: AsyncHasMany<MappingModel>;
  @belongsTo('concept', {
    inverse: 'templates',
    polymorphic: true,
    async: true,
  })
  declare parentConcept: AsyncHasMany<TemplateModel>;
}
