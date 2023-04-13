import { hasMany, attr } from '@ember-data/model';
import ResourceModel from './resource';

export default class ConceptModel extends ResourceModel {
  @attr() valid;
  @hasMany('template', { inverse: 'parentConcept', async: true }) templates;
  @hasMany('relation', { inverse: null, async: true, polymorphic: true })
  relations;

  get orderedRelations() {
    return this.relations.sortBy('order');
  }
}
