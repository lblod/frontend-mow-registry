import { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import Resource from './resource';
import type TrafficSignalConcept from './traffic-signal-concept';
import {
  validateBooleanRequired,
  validateEnumRequired,
  validateStringOptional,
  validateStringRequired,
  validateDateOptional,
  validateBelongsToOptional,
} from 'mow-registry/validators/schema';
import type TextVariable from './text-variable';
import type NumberVariable from './number-variable';
import type DateVariable from './date-variable';
import type LocationVariable from './location-variable';
import type CodelistVariable from './codelist-variable';
import type InstructionVariable from './instruction-variable';

export const signVariableTypesConst = [
  'text',
  'number',
  'date',
  'location',
  'codelist',
] as const;
export const allVariableTypesConst = [
  ...signVariableTypesConst,
  'instruction',
] as const;
// non-read-only version as this is needed for some interfaces
export const signVariableTypes = [...signVariableTypesConst];
export const allVariableTypes = [...allVariableTypesConst];
export type SignVariableType = (typeof signVariableTypesConst)[number];
export type VariableType = (typeof allVariableTypes)[number];

/** All types of variables. Exists to workaround issues with subclassing in ED */
export type VariableSubtype =
  | TextVariable
  | NumberVariable
  | DateVariable
  | LocationVariable
  | CodelistVariable
  | InstructionVariable;

export default class Variable extends Resource {
  declare [Type]: 'variable' | string;

  @attr declare uri: string;
  @attr declare type?: VariableType;
  @attr declare label?: string;
  @attr({ defaultValue: true }) declare required?: boolean;
  @attr('date') declare createdOn?: Date;

  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    inverse: 'variables',
    as: 'variable',
    async: true,
    polymorphic: true,
  })
  declare trafficSignalConcept: AsyncBelongsTo<TrafficSignalConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      type: validateEnumRequired(allVariableTypesConst),
      required: validateBooleanRequired(),
      createdOn: validateDateOptional(),
      trafficSignalConcept: validateBelongsToOptional(),
    });
  }
}
