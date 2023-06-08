import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';
import type SkosConcept from 'mow-registry/models/skos-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'traffic-measure-concept': TrafficMeasureConceptModel;
  }
}
export default class TrafficMeasureConceptModel extends ConceptModel {
  @attr declare label?: string;
  @attr declare temporal?: string;
  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;
}
