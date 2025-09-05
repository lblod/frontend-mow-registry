import { attr } from '@ember-data/model';
import Variable from './variable';
import { validateDateOptional } from 'mow-registry/validators/schema';
import LiteralVariable from './literal-variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class DateVariable extends LiteralVariable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'date-variable';

  @attr declare readonly type: 'date';

  @attr declare defaultValue?: Date;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateDateOptional(),
    });
  }
}

export function isDateVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `Type` brand discrepancies
variable is DateVariable {
  return variable?.type === 'date';
}
