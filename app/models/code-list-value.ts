import { validateNumberRequired } from 'mow-registry/validators/schema';
import SkosConcept from './skos-concept';
import { attr } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';

export default class CodeListValue extends SkosConcept {
  // @ts-expect-error TS doesn't like us extending classes with a `[Type]`
  declare [Type]: 'code-list-value';
  @attr declare position?: number;

  get validationSchema() {
    return super.validationSchema.keys({
      position: validateNumberRequired(),
    });
  }
}
