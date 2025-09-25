import Variable from './variable';
import { validateStringOptional } from 'mow-registry/validators/schema';
import LiteralVariable from './literal-variable';
import { attr } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';

export default class TextVariable extends LiteralVariable {
  declare [Type]: 'text-variable';

  @attr({ defaultValue: 'text' }) declare readonly type: 'text';

  @attr declare defaultValue?: string;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateStringOptional(),
    });
  }
}

export function isTextVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `defaultValue` attribute discrepancies
variable is TextVariable {
  return variable instanceof TextVariable;
}
