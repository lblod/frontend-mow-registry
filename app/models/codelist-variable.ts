import { attr } from '@ember-data/model';
import Variable from './variable';
import ReferenceVariable from './reference-variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class CodelistVariable extends ReferenceVariable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'codelist-variable';

  @attr declare readonly type: 'codelist';
}

export function isCodelistVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `Type` brand discrepancies
variable is CodelistVariable {
  return variable?.type === 'codelist';
}
