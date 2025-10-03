import type { Type } from '@warp-drive/core/types/symbols';
import Variable from './variable';

export default class LiteralVariable extends Variable {
  declare [Type]: 'literal-variable' | string;
}
