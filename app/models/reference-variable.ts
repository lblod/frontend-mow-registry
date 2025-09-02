import { belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import Variable from './variable';
import type CodeList from './code-list';
import {
  validateBelongsToRequired,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core-types/symbols';
import type SkosConcept from './skos-concept';

export default class ReferenceVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'reference-variable';

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare defaultValue: AsyncBelongsTo<SkosConcept>;

  @belongsTo<CodeList>('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeList>;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateStringOptional(),
      codeList: validateBelongsToRequired(),
    });
  }
}
