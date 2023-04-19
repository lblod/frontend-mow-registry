import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';
import SkosConcept from 'mow-registry/models/skos-concept';

export default class TrafficMeasureConceptModel extends ConceptModel {
  @attr declare label?: string;
  @attr declare temporal?: string;
  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;
}
