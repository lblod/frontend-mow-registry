import {
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import TrafficSignConcept from './traffic-sign-concept';
import SkosConcept from './skos-concept';
import {
  validateBelongsToOptional,
  validateBooleanRequired,
  validateHasManyOptional,
} from 'mow-registry/validators/schema';

export default class TrafficLightConcept extends TrafficSignConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-light-concept';

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  @hasMany<TrafficLightConcept>('traffic-light-concept', {
    inverse: 'relatedFromTrafficLightConcepts',
    async: true,
  })
  declare relatedToTrafficLightConcepts: AsyncHasMany<TrafficLightConcept>;

  @hasMany<TrafficLightConcept>('traffic-light-concept', {
    inverse: 'relatedToTrafficLightConcepts',
    async: true,
  })
  declare relatedFromTrafficLightConcepts: AsyncHasMany<TrafficLightConcept>;

  // This property is used to house the combined data of the relatedToTrafficLightConcepts and relatedFromTrafficLightConcepts relationships.
  // We need both since we want to display all related signs, not only a single direction.
  // TODO: move this state to the edit page, we don't need to store this on the record itself
  relatedTrafficLightConcepts: TrafficLightConcept[] = [];

  @hasMany<RoadSignConcept>('road-sign-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConcept>;

  @hasMany<RoadMarkingConcept>('road-marking-concept', {
    inverse: 'relatedTrafficLightConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      valid: validateBooleanRequired(),
      zonality: validateBelongsToOptional(),
      relatedToTrafficLightConcepts: validateHasManyOptional(),
      relatedFromTrafficLightConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
    });
  }
}
