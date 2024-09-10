import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SkosConcept from 'mow-registry/models/skos-concept';
import TrafficSignConceptModel from './traffic-sign-concept';
import TemplateModel from './template';

export default class TrafficMeasureConceptModel extends Model {
  declare [Type]: 'traffic-measure-concept';
  @attr declare label?: string;
  @attr declare variableSignage?: string;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany('traffic-sign-concept', {
    inverse: 'hasTrafficMeasureConcepts',
    async: true,
    polymorphic: true,
  })
  declare relatedTrafficSignConcepts: AsyncHasMany<TrafficSignConceptModel>;

  @belongsTo('template', { async: true, inverse: 'parentConcept' })
  declare template: AsyncBelongsTo<TemplateModel>;
}
