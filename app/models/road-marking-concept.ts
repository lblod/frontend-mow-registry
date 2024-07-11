import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import ConceptModel from 'mow-registry/models/concept';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import SkosConcept from './skos-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'road-marking-concept': RoadMarkingConceptModel;
  }
}

export default class RoadMarkingConceptModel extends ConceptModel {
  @attr declare image?: string;
  @attr declare meaning?: string;
  @attr declare definition?: string;
  @attr declare roadMarkingConceptCode?: string;

  get label() {
    return this.roadMarkingConceptCode;
  }

  @belongsTo('road-marking-concept-status-code', {
    inverse: 'roadMarkingConcepts',
    async: true,
  })
  declare status: AsyncBelongsTo<RoadSignConceptStatusCodeModel>;

  @belongsTo('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedFromRoadMarkingConcepts',
    async: true,
  })
  declare relatedToRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  @hasMany('road-marking-concept', {
    inverse: 'relatedToRoadMarkingConcepts',
    async: true,
  })
  declare relatedFromRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  relatedRoadMarkingConcepts?: RoadMarkingConceptModel[];

  @hasMany('road-sign-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      image: validateStringRequired(),
      meaning: validateStringRequired(),
      definition: validateStringRequired(),
      roadMarkingConceptCode: validateStringRequired(),
      status: validateBelongsToOptional(),
      zonality: validateBelongsToOptional(),
      relatedToRoadMarkingConcepts: validateHasManyOptional(),
      relatedFromRoadMarkingConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedTrafficLightConcepts: validateHasManyOptional(),
    });
  }
}
