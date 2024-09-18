import { hasMany, AsyncHasMany } from '@ember-data/model';
import Resource from 'mow-registry/models/resource';
import type Template from 'mow-registry/models/template';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Concept extends Resource {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'concept';

  @hasMany<Template>('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      templates: validateHasManyOptional(),
    });
  }
}
