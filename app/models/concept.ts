import { hasMany, attr, AsyncHasMany } from '@ember-data/model';
import ResourceModel from 'mow-registry/models/resource';
import type RelationModel from 'mow-registry/models/relation';
import type TemplateModel from 'mow-registry/models/template';
import { unwrap } from 'mow-registry/utils/option';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    concept: ConceptModel;
  }
}
export default class ConceptModel extends ResourceModel {
  @attr() declare valid?: boolean;

  @hasMany('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<TemplateModel>;

  @hasMany('relation', { inverse: null, async: true, polymorphic: true })
  declare relations: AsyncHasMany<RelationModel>;

  async getOrderedRelations() {
    const relations = await this.relations;
    return relations.slice().sort((a, b) => unwrap(a.order) - unwrap(b.order));
  }

  //TODO: we still use this getter in the template of the SearchTables::TrafficMeasure component, but we should refactor this
  get orderedRelations() {
    return this.relations.sortBy('order');
  }
}
