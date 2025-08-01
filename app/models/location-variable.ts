import { attr } from '@ember-data/model';
import Variable, { type VariableSubtype } from './variable';
import { validateStringOptional } from 'mow-registry/validators/schema';

export default class LocationVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'location-variable';

  @attr declare readonly type: 'location';

  @attr declare defaultValue?: string;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateStringOptional(),
    });
  }
}

export function isLocationVariable(
  variable: Variable | VariableSubtype | undefined,
): variable is LocationVariable {
  return variable?.type === 'location';
}
