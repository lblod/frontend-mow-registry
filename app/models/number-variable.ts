import { attr } from '@ember-data/model';
import Variable from './variable';
import { validateNumberOptional } from 'mow-registry/validators/schema';

export default class NumberVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'number-variable';

  @attr declare readonly type: 'number';

  @attr declare defaultValue?: number;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateNumberOptional(),
    });
  }
}
