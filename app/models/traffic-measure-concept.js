import { attr } from '@ember-data/model';
import ConceptModel from './concept';

export default class TrafficMeasureConceptModel extends ConceptModel {
  @attr label;
}
