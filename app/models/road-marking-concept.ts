import { hasMany, type AsyncHasMany } from '@warp-drive/legacy/model';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import TrafficSignalConcept from './traffic-signal-concept';
import {
  validateHasManyOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';
import type { Type } from '@warp-drive/core/types/symbols';

export default class RoadMarkingConcept extends TrafficSignalConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'road-marking-concept';

  @hasMany<RoadMarkingConcept>('road-marking-concept', {
    inverse: 'relatedFromRoadMarkingConcepts',
    async: true,
  })
  declare relatedToRoadMarkingConcepts: AsyncHasMany<RoadMarkingConcept>;

  @hasMany<RoadMarkingConcept>('road-marking-concept', {
    inverse: 'relatedToRoadMarkingConcepts',
    async: true,
  })
  declare relatedFromRoadMarkingConcepts: AsyncHasMany<RoadMarkingConcept>;

  // This property is used to house the combined data of the relatedToRoadMarkingConcepts and relatedFromRoadMarkingConcepts relationships.
  // We need both since we want to display all related signs, not only a single direction.
  // TODO: move this state to the edit page, we don't need to store this on the record itself
  relatedRoadMarkingConcepts: RoadMarkingConcept[] = [];

  @hasMany<RoadSignConcept>('road-sign-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedRoadSignConcepts: AsyncHasMany<RoadSignConcept>;

  @hasMany<TrafficLightConcept>('traffic-light-concept', {
    inverse: 'relatedRoadMarkingConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      shapes: validateHasManyOptional(),
      meaning: validateStringRequired(),
      relatedToRoadMarkingConcepts: validateHasManyOptional(),
      relatedFromRoadMarkingConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedTrafficLightConcepts: validateHasManyOptional(),
    });
  }
}
