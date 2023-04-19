import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import type ConceptModel from 'mow-registry/models/concept';

export default class RelationModel extends Model {
  @attr('number') declare expectedNumber?: number;
  @attr('string') declare reason?: string;
  @attr('number') declare order?: number;
  @belongsTo('concept', { inverse: null, async: true, polymorphic: true })
  declare concept: AsyncBelongsTo<ConceptModel>;
}
