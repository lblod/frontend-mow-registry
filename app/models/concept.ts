import { hasMany, type AsyncHasMany } from '@warp-drive/legacy/model';
import Resource from 'mow-registry/models/resource';
import type Template from 'mow-registry/models/template';
import { validateHasManyOptional } from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core/types/symbols';

export default class Concept extends Resource {
  declare [Type]: 'concept';

  @hasMany<Template>('template', { inverse: 'parentConcept', async: true })
  declare templates: AsyncHasMany<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      templates: validateHasManyOptional(),
    });
  }
}
