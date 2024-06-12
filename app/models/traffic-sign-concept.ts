import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import type ImageModel from 'mow-registry/models/image';

export default class TrafficSignConceptModel extends SkosConcept {
  @attr declare meaning?: string;

  @belongsTo('image', { async: true, inverse: null })
  declare image: AsyncBelongsTo<ImageModel>;

  // @belongsTo('skos-concept', { async: true, inverse: null })
  // declare status: AsyncBelongsTo<SkosConcept>;

  // @hasMany('template', { async: true, inverse: null })
  // declare hasInstruction: AsyncHasMany<TemplateModel>;

  // @hasMany('traffic-measure-concept', { async: true, inverse: null })
  // declare hasTrafficMeasureConcept: AsyncHasMany<TrafficMeasureConceptModel>;
}
