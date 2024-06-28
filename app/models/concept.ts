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
}
