import { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import Variable from './variable';
import { validateBelongsToRequired } from 'mow-registry/validators/schema';
import type Template from './template';

export default class InstructionVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'instruction-variable';

  @attr declare readonly type = 'instruction';

  @belongsTo<Template>('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      template: validateBelongsToRequired(),
    });
  }
}
