import type { Type } from '@warp-drive/core/types/symbols';
import Variable from './variable';
import { attr } from '@warp-drive/legacy/model';

export default class LocationVariable extends Variable {
  declare [Type]: 'location-variable';

  @attr declare readonly type: 'location';
}

export function isLocationVariable(
  variable: Variable | undefined,
): variable is LocationVariable {
  return variable instanceof LocationVariable;
}
