import { attr } from '@ember-data/model';
import Variable from './variable';
import type { Type } from '@warp-drive/core-types/symbols';

export default class LocationVariable extends Variable {
  declare [Type]: 'location-variable';

  @attr declare readonly type: 'location';
}

export function isLocationVariable(
  variable: Variable | undefined,
): variable is LocationVariable {
  return variable?.type === 'location';
}
