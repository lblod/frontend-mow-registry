import { hasMany, attr, AsyncHasMany } from '@ember-data/model';
import ResourceModel from 'mow-registry/models/resource';
import type TemplateModel from 'mow-registry/models/template';
import Joi from 'joi';
import { validateHasManyOptional } from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    concept: ConceptModel;
  }
}
export default class ConceptModel extends ResourceModel {
  @attr() declare valid?: boolean;

  @hasMany('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<TemplateModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      valid: Joi.boolean().optional(),
      templates: validateHasManyOptional(),
    });
  }
}
