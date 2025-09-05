import { attr } from '@ember-data/model';
import Variable from './variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class LocationVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'location-variable';

  @attr declare readonly type: 'location';
}

export function isLocationVariable(
  variable: Variable | undefined,
): // @ts-expect-error typescript gives an error due to the `Type` brand discrepancies
variable is LocationVariable {
  return variable?.type === 'location';
}
