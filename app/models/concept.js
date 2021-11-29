import { hasMany, attr } from '@ember-data/model';
import ResourceModel from './resource';

export default class ConceptModel extends ResourceModel {
  @attr() valid;
  @hasMany('template', { inverse: "parentConcept" }) templates;
  @hasMany('relation', { polyMorphic: true }, { inverse: null }) relations;

  get orderedRelations() {
    return this.relations.sortBy('order');
  }
}
