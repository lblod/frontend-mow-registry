import { attr } from '@ember-data/model';
import Variable from './variable';
import ReferenceVariable from './reference-variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class CodelistVariable extends ReferenceVariable {
  declare [Type]: 'codelist-variable';

  @attr declare readonly type: 'codelist';
}

export function isCodelistVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `defaultValue` attribute discrepancies
variable is CodelistVariable {
  return variable instanceof CodelistVariable;
}
