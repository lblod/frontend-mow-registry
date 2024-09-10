import {
  hasMany,
  belongsTo,
  AsyncBelongsTo,
  AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import TrafficSignConceptModel from './traffic-sign-concept';
import SkosConcept from './skos-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
} from 'mow-registry/validators/schema';

export default class TrafficLightConceptModel extends TrafficSignConceptModel {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-light-concept';

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

  // This property is used to house the combined data of the relatedToTrafficLightConcepts and relatedFromTrafficLightConcepts relationships.
  // We need both since we want to display all related signs, not only a single direction.
  // TODO: move this state to the edit page, we don't need to store this on the record itself
  relatedTrafficLightConcepts: TrafficLightConceptModel[] = [];

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
      zonality: validateBelongsToOptional(),
      relatedToTrafficLightConcepts: validateHasManyOptional(),
      relatedFromTrafficLightConcepts: validateHasManyOptional(),
      relatedRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
    });
  }
}
