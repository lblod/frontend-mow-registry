import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type SkosConcept from 'mow-registry/models/skos-concept';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'concept-scheme': ConceptScheme;
  }
}

export default class ConceptScheme extends Model {
  @attr declare label?: string;
  @hasMany('skos-concept', { inverse: 'inScheme', async: true })
  declare concepts: AsyncHasMany<SkosConcept>;
}
