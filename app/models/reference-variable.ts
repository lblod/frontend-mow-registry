import Variable from './variable';
import type CodeList from './code-list';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
} from 'mow-registry/validators/schema';
import type SkosConcept from './skos-concept';
import type { Type } from '@warp-drive/core/types/symbols';
import { belongsTo, type AsyncBelongsTo } from '@warp-drive/legacy/model';

export default class ReferenceVariable extends Variable {
  declare [Type]: 'reference-variable' | string;

  @belongsTo<SkosConcept>('skos-concept', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare defaultValue: AsyncBelongsTo<SkosConcept>;

  @belongsTo<CodeList>('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeList>;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateBelongsToOptional(),
      codeList: validateBelongsToRequired(),
    });
  }
}
