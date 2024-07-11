import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import TrafficSignConceptModel from './traffic-sign-concept';
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

export default class RoadMarkingConceptModel extends TrafficSignConceptModel {
  @attr declare definition?: string;

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
