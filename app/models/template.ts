import Model, {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type MappingModel from './mapping';

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
