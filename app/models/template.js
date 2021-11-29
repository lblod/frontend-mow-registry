import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class TemplateModel extends Model {
  @attr('string') value;
  @hasMany('mapping') mappings;
  @belongsTo('concept', { inverse: 'templates' }) parentConcept;
}
