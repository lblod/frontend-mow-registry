import { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import Variable, { type VariableSubtype } from './variable';
import {
  validateBelongsToRequired,
  validateStringOptional,
} from 'mow-registry/validators/schema';
import type CodeList from './code-list';

export default class CodelistVariable extends Variable {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'codelist-variable';

  @attr declare readonly type: 'codelist';

  @attr declare defaultValue?: string;

  @belongsTo<CodeList>('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeList>;

  get validationSchema() {
    return super.validationSchema.keys({
      defaultValue: validateStringOptional(),
      codeList: validateBelongsToRequired(),
    });
  }
}

export function isCodelistVariable(
  variable: Variable | VariableSubtype | undefined,
): variable is CodelistVariable {
  return variable?.type === 'codelist';
}
