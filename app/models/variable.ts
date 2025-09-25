import { type AsyncBelongsTo, belongsTo, attr } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';
import type CodeList from './code-list';
import type Template from './template';
import {
  validateBelongsToOptional,
  validateStringOptional,
  validateStringRequired,
  validateBooleanRequired,
} from 'mow-registry/validators/schema';
import Joi from 'joi';
import AbstractValidationModel from './abstract-validation-model';

export default class Variable extends AbstractValidationModel {
  declare [Type]: 'variable';

  @attr declare uri: string;
  @attr declare type?: string;
  @attr declare label?: string;
  @attr declare defaultValue?: string;
  @attr({ defaultValue: true }) declare required?: boolean;

  @belongsTo<CodeList>('code-list', { inverse: 'variables', async: true })
  declare codeList: AsyncBelongsTo<CodeList>;

  @belongsTo<Template>('template', { inverse: null, async: true })
  declare template: AsyncBelongsTo<Template>;

  get validationSchema() {
    return Joi.object({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      type: validateStringRequired(),
      defaultValue: validateStringOptional(),
      required: validateBooleanRequired(),
      codeList: validateBelongsToOptional(),
      template: validateBelongsToOptional(),
    });
  }
}
