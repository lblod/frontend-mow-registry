import { type AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type CodeList from './code-list';
import type Template from './template';
import Resource from './resource';
import {
  validateBelongsToOptional,
  validateStringOptional,
  validateStringRequired,
  validateBooleanRequired,
} from 'mow-registry/validators/schema';
import type TrafficSignalConcept from './traffic-signal-concept';

export default class Variable extends Resource {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
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

  @belongsTo<TrafficSignalConcept>('traffic-signal-concept', {
    inverse: 'variables',
    async: true,
    polymorphic: true,
  })
  declare trafficSignalConcept: AsyncBelongsTo<TrafficSignalConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired(),
      type: validateStringRequired(),
      defaultValue: validateStringOptional(),
      required: validateBooleanRequired(),
      codeList: validateBelongsToOptional(),
      template: validateBelongsToOptional(),
      trafficSignalConcept: validateBelongsToOptional(),
    });
  }
}
