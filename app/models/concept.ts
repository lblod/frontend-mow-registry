import { hasMany, attr, AsyncHasMany } from '@ember-data/model';
import ResourceModel from 'mow-registry/models/resource';
import type Template from 'mow-registry/models/template';
import Joi from 'joi';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';

export default class ConceptModel extends ResourceModel {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'concept';
  @attr() declare valid?: boolean;

  @hasMany<Template>('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      valid: Joi.boolean().optional(),
      templates: validateHasManyOptional(),
    });
  }
}
