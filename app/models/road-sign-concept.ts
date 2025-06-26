import {
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
  validateHasManyRequired,
} from 'mow-registry/validators/schema';
import TrafficSignConcept from './traffic-sign-concept';
import RoadSignCategory from './road-sign-category';
import type SkosConcept from './skos-concept';
import type { Type } from '@warp-drive/core-types/symbols';
import type Variable from './variable';

export default class RoadSignConcept extends TrafficSignConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'road-sign-concept';

  @hasMany('variable', {
    inverse: null,
    async: true,
  })
  declare variables: AsyncHasMany<Variable>;

  @hasMany('road-sign-category', {
    inverse: 'roadSignConcepts',
    async: true,
  })
  declare classifications: AsyncHasMany<RoadSignCategory>;

  @hasMany('road-sign-concept', { inverse: 'mainSigns', async: true })
  declare subSigns: AsyncHasMany<RoadSignConcept>;

  @hasMany('road-sign-concept', { inverse: 'subSigns', async: true })
  declare mainSigns: AsyncHasMany<RoadSignConcept>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedFromRoadSignConcepts',
    async: true,
  })
  declare relatedToRoadSignConcepts: AsyncHasMany<RoadSignConcept>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedToRoadSignConcepts',
    async: true,
  })
  declare relatedFromRoadSignConcepts: AsyncHasMany<RoadSignConcept>;

  // This property is used to house the combined data of the relatedToRoadSignConcepts and relatedFromRoadSignConcepts relationships.
  // We need both since we want to display all related signs, not only a single direction.
  // TODO: move this state to the edit page, we don't need to store this on the record itself
  relatedRoadSignConcepts: Array<RoadSignConcept> = [];

  @hasMany('road-marking-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConcept>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConcept>;

  @belongsTo<SkosConcept>('skos-concept', { inverse: null, async: true })
  declare zonality: AsyncBelongsTo<SkosConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      shapes: validateHasManyRequired(
        'road-sign-concept.atLeastOneShapeRequired',
      ),
      variables: validateHasManyOptional(),
      classifications: validateHasManyRequired(),
      subSigns: validateHasManyOptional(),
      mainSigns: validateHasManyOptional(),
      relatedToRoadSignConcepts: validateHasManyOptional(),
      relatedFromRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
      relatedTrafficLightConcepts: validateHasManyOptional(),
      zonality: validateBelongsToOptional(),
    });
  }
}
