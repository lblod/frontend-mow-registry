import Shape from 'mow-registry/models/shape';
import type { Type } from '@warp-drive/core/types/symbols';

export default class NodeShape extends Shape {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'node-shape';
}
