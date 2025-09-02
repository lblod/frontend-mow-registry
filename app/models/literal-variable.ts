import type { Type } from '@warp-drive/core-types/symbols';
import Variable from './variable';

export default class LiteralVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'literal-variable';
}
