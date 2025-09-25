import Variable from './variable';
import { validateDateOptional } from 'mow-registry/validators/schema';
import LiteralVariable from './literal-variable';
import type { Type } from '@warp-drive/core/types/symbols';
import { attr } from '@warp-drive/legacy/model';

export default class DateVariable extends LiteralVariable {
  declare [Type]: 'date-variable';

  @attr declare readonly type: 'date';

  @attr('date') declare defaultValue?: Date;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateDateOptional(),
    });
  }
}

export function isDateVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `defaultValue` attribute discrepancies
variable is DateVariable {
  return variable?.type === 'date';
}
