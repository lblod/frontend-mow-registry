import { hasMany } from '@ember-data/model';
import ResourceModel from './resource';

export default class ConceptModel extends ResourceModel {
  @hasMany('template') templates;
  @hasMany('relation', { polyMorphic: true }) relations;
}
