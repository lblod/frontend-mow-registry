import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import ConceptModel from './concept';
import type TrafficLightConceptStatusCodeModel from 'mow-registry/models/traffic-light-concept-status-code';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import SkosConcept from './skos-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'traffic-light-concept': TrafficLightConceptModel;
  }
}
export default class TrafficLightConceptModel extends ConceptModel {
  @attr declare image?: string;
  @attr declare meaning?: string;
  @attr declare definition?: string;
  @attr declare trafficLightConceptCode?: string;

  get label() {
    return this.trafficLightConceptCode;
  }

  @belongsTo('traffic-light-concept-status-code', {
    inverse: 'trafficLightConcepts',
    async: true,
  })
  declare status: AsyncBelongsTo<TrafficLightConceptStatusCodeModel>;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedFromTrafficLightConcepts',
    async: true,
  })
  declare relatedToTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedToTrafficLightConcepts',
    async: true,
  })
  declare relatedFromTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  relatedTrafficLightConcepts?: TrafficLightConceptModel[];

  @hasMany('road-sign-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateStringRequired(),
      meaning: validateStringRequired(),
      definition: validateStringRequired(),
      trafficLightConceptCode: validateStringRequired(),
      status: validateBelongsToOptional(),
      zonality: validateBelongsToOptional(),
      relatedToTrafficLightConcepts: validateHasManyOptional(),
      relatedFromTrafficLightConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
    });
  }
}
