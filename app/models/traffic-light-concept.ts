import {
  attr,
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import TrafficSignConceptModel from './traffic-sign-concept';
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
export default class TrafficLightConceptModel extends TrafficSignConceptModel {
  @attr declare definition?: string;

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
      definition: validateStringRequired(),
      zonality: validateBelongsToOptional(),
      relatedToTrafficLightConcepts: validateHasManyOptional(),
      relatedFromTrafficLightConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
    });
  }
}
