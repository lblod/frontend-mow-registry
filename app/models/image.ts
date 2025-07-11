import Document from 'mow-registry/models/document';
import type { Type } from '@warp-drive/core/types/symbols';

export default class Image extends Document {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'image';
}
