import { hasMany, attr, AsyncHasMany } from '@ember-data/model';
import ResourceModel from './resource';
import type TemplateModel from 'mow-registry/models/template';
import type RelationModel from 'mow-registry/models/relation';

/** @extends ResourceModel */
export default class ConceptModel extends ResourceModel {
  @attr() declare valid?: boolean;

  @hasMany('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<TemplateModel>;

  @hasMany('relation', { inverse: null, async: true, polymorphic: true })
  declare relations: AsyncHasMany<RelationModel>;

  get orderedRelations() {
    return this.relations.sortBy('order');
  }
}
