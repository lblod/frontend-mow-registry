import { type AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Template from './template';
import Resource from './resource';
import {
  validateBelongsToOptional,
  validateBooleanRequired,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

export type VariableType =
  | 'text'
  | 'number'
  | 'date'
  | 'location'
  | 'codelist'
  | 'instruction';
export default class Variable extends Resource {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'variable';

  @attr declare uri: string;
  @attr declare type?: VariableType;
  @attr declare label?: string;
  @attr({ defaultValue: true }) declare required?: boolean;

  @belongsTo<Template>('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      type: validateStringRequired(),
      required: validateBooleanRequired(),
      template: validateBelongsToOptional(),
    });
  }
}
