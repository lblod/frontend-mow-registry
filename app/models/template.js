import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class TemplateModel extends Model {
  @attr('string') value;
  @attr('string') annotated;
  @hasMany('mapping', { inverse: null, async: true }) mappings;
  @belongsTo('concept', {
    inverse: 'templates',
    polymorphic: true,
    async: true,
  })
  parentConcept;
}
