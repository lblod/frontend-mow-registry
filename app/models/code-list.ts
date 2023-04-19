import {
  hasMany,
  belongsTo,
  attr,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import ConceptSchemeModel from './concept-scheme';
import type MappingModel from 'mow-registry/models/mapping';
import type SkosConcept from 'mow-registry/models/skos-concept';

export default class CodeListModel extends ConceptSchemeModel {
  @attr declare uri?: string;
  @hasMany('mapping', { inverse: 'codeList', async: true })
  declare mappings: AsyncHasMany<MappingModel>;
  @belongsTo('skos-concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<SkosConcept>;
}
