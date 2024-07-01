import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import type SkosConcept from 'mow-registry/models/skos-concept';
import TrafficSignConceptModel from './traffic-sign-concept';
import TemplateModel from './template';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'traffic-measure-concept': TrafficMeasureConceptModel;
  }
}
export default class TrafficMeasureConceptModel extends Model {
  @attr declare label?: string;
  @attr declare temporal?: string;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany('traffic-sign-concept', {
    inverse: 'measures',
    async: true,
    polymorphic: true,
  })
  declare signs: AsyncHasMany<TrafficSignConceptModel>;

  @belongsTo('template', { async: true })
  declare template: AsyncBelongsTo<TemplateModel>;
}
