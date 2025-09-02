import { attr } from '@ember-data/model';
import Variable, { type VariableSubtype } from './variable';
import { validateStringOptional } from 'mow-registry/validators/schema';
import LiteralVariable from './literal-variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class TextVariable extends LiteralVariable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'text-variable';

  @attr declare readonly type: 'text';

  @attr declare defaultValue?: string;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateStringOptional(),
    });
  }
}

export function isTextVariable(
  variable: Variable | VariableSubtype | undefined,
): variable is TextVariable {
  return variable?.type === 'text';
}
