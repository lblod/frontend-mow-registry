import Model, {
  type AsyncBelongsTo,
  attr,
  belongsTo,
} from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core/types/symbols';
import type SkosConcept from './skos-concept';

export default class ConceptHistoryNote extends Model {
  declare [Type]: 'concept-history-note';
  @attr declare value?: string;
  @attr declare previousConceptLabel?: string;
  @attr('date') declare createdOn?: Date;

  @belongsTo<SkosConcept>('skos-concept', {
    inverse: 'historyNotes',
    as: 'concept-history-note',
    polymorphic: true,
    async: true,
  })
  declare concept: AsyncBelongsTo<SkosConcept>;
}
