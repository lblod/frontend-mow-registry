import Model, {
  type AsyncBelongsTo,
  type AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TrafficSignConcept from './traffic-sign-concept';
import type Template from './template';

export default class TrafficMeasureConcept extends Model {
  declare [Type]: 'traffic-measure-concept';
  @attr declare label?: string;
  @attr declare variableSignage?: boolean;
  @attr declare valid?: boolean;

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany<TrafficSignConcept>('traffic-sign-concept', {
    inverse: 'hasTrafficMeasureConcepts',
    async: true,
    polymorphic: true,
  })
  declare relatedTrafficSignConcepts: AsyncHasMany<TrafficSignConcept>;

  @belongsTo<Template>('template', { async: true, inverse: 'parentConcept' })
  declare template: AsyncBelongsTo<Template>;
}
