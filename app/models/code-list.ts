import {
  hasMany,
  belongsTo,
  attr,
  type AsyncHasMany,
  type AsyncBelongsTo,
} from '@ember-data/model';
import ConceptScheme from 'mow-registry/models/concept-scheme';
import type Variable from 'mow-registry/models/variable';
import type SkosConcept from 'mow-registry/models/skos-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';

export default class CodeList extends ConceptScheme {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'code-list';
  @attr declare uri?: string;
  @hasMany<Variable>('variable', { inverse: 'codeList', async: true })
  declare variables: AsyncHasMany<Variable>;
  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<SkosConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      variables: validateHasManyOptional(),
      type: validateBelongsToOptional(),
    });
  }
}
