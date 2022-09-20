import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class TemplateModel extends Model {
  @attr('string') value;
  @attr('string') annotated;
  @hasMany('mapping') mappings;
  @belongsTo('concept', { inverse: 'templates', polymorphic: true })
  parentConcept;
}
