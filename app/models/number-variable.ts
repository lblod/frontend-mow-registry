import { attr } from '@ember-data/model';
import Variable from './variable';
import { validateNumberOptional } from 'mow-registry/validators/schema';
import LiteralVariable from './literal-variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class NumberVariable extends LiteralVariable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'number-variable';

  @attr declare readonly type: 'number';

  @attr declare defaultValue?: number;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateNumberOptional(),
    });
  }
}

export function isNumberVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `Type` brand discrepancies
variable is NumberVariable {
  return variable?.type === 'number';
}
