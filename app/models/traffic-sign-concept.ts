import {
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import type TemplateModel from 'mow-registry/models/template';
import type TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';
import type ImageModel from 'mow-registry/models/image';

export default class TrafficSignConceptModel extends SkosConcept {
  @attr declare meaning?: string;
  @attr declare code?: string;

  // @belongsTo('image', { async: true, inverse: null })
  // declare image: AsyncBelongsTo<ImageModel>;

  // @belongsTo('skos-concept', { async: true, inverse: null })
  // declare status: AsyncBelongsTo<SkosConcept>;

  // @hasMany('template', { async: true, inverse: null })
  // declare hasInstruction: AsyncHasMany<TemplateModel>;

  // @hasMany('traffic-measure-concept', { async: true, inverse: null })
  // declare hasTrafficMeasureConcept: AsyncHasMany<TrafficMeasureConceptModel>;
}
