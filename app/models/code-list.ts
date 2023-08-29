import {
  hasMany,
  belongsTo,
  attr,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import ConceptScheme from 'mow-registry/models/concept-scheme';
import type MappingModel from 'mow-registry/models/mapping';
import type SkosConcept from 'mow-registry/models/skos-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'code-list': CodeListModel;
  }
}

export default class CodeListModel extends ConceptScheme {
  @attr declare uri?: string;
  @hasMany('mapping', { inverse: 'codeList', async: true })
  declare mappings: AsyncHasMany<MappingModel>;
  @belongsTo('skos-concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<SkosConcept>;
}
