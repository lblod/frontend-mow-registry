import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type ConceptScheme from 'mow-registry/models/concept-scheme';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'skos-concept': SkosConcept;
  }
}
export default class SkosConcept extends Model {
  @attr declare uri?: string;
  @attr declare label?: string;
  @belongsTo('concept-scheme', {
    inverse: 'concepts',
    polymorphic: true,
    async: true,
  })
  declare inScheme: AsyncBelongsTo<ConceptScheme>;
}
