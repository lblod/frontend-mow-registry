import { attr, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class TrafficMeasureConceptModel extends ConceptModel {
  @attr label;
  @belongsTo('skos-concept', { inverse: null }) zonality;
}
