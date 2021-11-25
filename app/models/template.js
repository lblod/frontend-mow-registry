import Model, { attr, hasMany } from '@ember-data/model';

export default class TemplateModel extends Model {
  @attr('string') value;
  @attr('string') annotated;
  @hasMany('mapping') mappings;
}
