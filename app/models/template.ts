import {
  attr,
  hasMany,
  belongsTo,
  type AsyncHasMany,
  type AsyncBelongsTo,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type TrafficMeasureConcept from './traffic-measure-concept';
import Document from './document';
import type Variable from './variable';

export default class Template extends Document {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'template';
  @attr declare value?: string;

  @hasMany<Variable>('variable', { inverse: null, async: true })
  declare variables: AsyncHasMany<Variable>;

  @belongsTo<TrafficMeasureConcept>('traffic-measure-concept', {
    inverse: 'template',
    async: true,
  })
  declare parentConcept: AsyncBelongsTo<TrafficMeasureConcept>;
}
