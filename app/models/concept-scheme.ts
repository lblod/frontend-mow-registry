import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type SkosConcept from 'mow-registry/models/skos-concept';

export default class ConceptScheme extends Model {
  @attr declare label?: string;
  @hasMany('skos-concept', { inverse: 'inScheme', async: true })
  declare concepts: AsyncHasMany<SkosConcept>;
}
