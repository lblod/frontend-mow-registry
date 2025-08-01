import { attr } from '@ember-data/model';
import Variable, { type VariableSubtype } from './variable';
import { validateDateOptional } from 'mow-registry/validators/schema';

export default class DateVariable extends Variable {
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
  variable: Variable | VariableSubtype | undefined,
): variable is DateVariable {
  return variable?.type === 'date';
}
