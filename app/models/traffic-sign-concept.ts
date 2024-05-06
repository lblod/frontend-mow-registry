import Model, { AsyncHasMany, attr, belongsTo, hasMany, AsyncBelongsTo, } from '@ember-data/model';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type TemplateModel from 'mow-registry/models/template';
import type TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';


export default class TrafficSignConceptModel extends Model {
  @attr declare meaning?: string;
  @attr declare code?: string ;

  @belongsTo('document', { async: true, inverse: null });
  declare image: AsyncBelongsTo<DocumentModel>;
  @belongsTo('skos-concept', { async: true, inverse: null }) 
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany('template', { async: true, inverse: null })
  declare hasInstruction: AsyncHasMany<TemplateModel>;
  @hasMany('traffic-measure-concept', { async: true, inverse: null })
  declare hasTrafficMeasureConcept: AsyncHasMany<TrafficMeasureConceptModel>;
}
