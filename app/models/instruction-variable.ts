import { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import Variable from './variable';
import { validateBelongsToRequired } from 'mow-registry/validators/schema';
import type Template from './template';
import type { Type } from '@warp-drive/core-types/symbols';

export default class InstructionVariable extends Variable {
  declare [Type]: 'instruction-variable';

  @attr declare readonly type: 'instruction';

  @belongsTo<Template>('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      template: validateBelongsToRequired(),
    });
  }
}

export function isInstructionVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `Type` brand discrepancies
variable is InstructionVariable {
  return variable?.type === 'instruction';
}
