import { hasMany, belongsTo } from '@ember-data/model';
import ResourceModel from './resource';

export default class ConceptModel extends ResourceModel {
  @belongsTo('template') template;
  @hasMany('relation', { polyMorphic: true }, { inverse: null }) relations;

  get orderedRelations() {
    return this.relations.sortBy('order');
  }
}
