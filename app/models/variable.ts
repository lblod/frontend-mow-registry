import { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import Resource from './resource';
import {
  validateBooleanRequired,
  validateEnumRequired,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

export const signVariableTypesConst = [
  'text',
  'number',
  'date',
  'location',
  'codelist',
] as const;
// non-read-only version as this is needed for some interfaces
export const signVariableTypes = [...signVariableTypesConst];
export const allVariableTypes = [
  ...signVariableTypesConst,
  'instruction',
] as const;
export type SignVariableType = (typeof signVariableTypesConst)[number];
export type VariableType = (typeof allVariableTypes)[number];

export default class Variable extends Resource {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'variable';

  @attr declare uri: string;
  @attr declare type?: VariableType;
  @attr declare label?: string;
  @attr({ defaultValue: true }) declare required?: boolean;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      type: validateEnumRequired(allVariableTypes),
      required: validateBooleanRequired(),
    });
  }
}
