import { hasMany, AsyncHasMany } from '@ember-data/model';
import type RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import type TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import {
  validateHasManyOptional,
  validateHasManyRequired,
} from 'mow-registry/validators/schema';
import TrafficSignConceptModel from './traffic-sign-concept';
import RoadSignCategoryModel from './road-sign-category';
import TribontShapeModel from './tribont-shape';
import type { Type } from '@warp-drive/core-types/symbols';

export default class RoadSignConceptModel extends TrafficSignConceptModel {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'road-sign-concept';

  @hasMany('road-sign-category', {
    inverse: 'roadSignConcepts',
    async: true,
  })
  declare classifications: AsyncHasMany<RoadSignCategoryModel>;

  @hasMany('tribont-shape', { inverse: null, async: true })
  declare shapes: AsyncHasMany<TribontShapeModel>;

  @hasMany('road-sign-concept', { inverse: 'mainSigns', async: true })
  declare subSigns: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', { inverse: 'subSigns', async: true })
  declare mainSigns: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedFromRoadSignConcepts',
    async: true,
  })
  declare relatedToRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  @hasMany('road-sign-concept', {
    inverse: 'relatedToRoadSignConcepts',
    async: true,
  })
  declare relatedFromRoadSignConcepts: AsyncHasMany<RoadSignConceptModel>;

  // This property is used to house the combined data of the relatedToRoadSignConcepts and relatedFromRoadSignConcepts relationships.
  // We need both since we want to display all related signs, not only a single direction.
  // TODO: move this state to the edit page, we don't need to store this on the record itself
  relatedRoadSignConcepts: Array<RoadSignConceptModel> = [];

  @hasMany('road-marking-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedRoadMarkingConcepts: AsyncHasMany<RoadMarkingConceptModel>;

  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  declare relatedTrafficLightConcepts: AsyncHasMany<TrafficLightConceptModel>;

  get validationSchema() {
    return super.validationSchema.keys({
      shapes: validateHasManyRequired(),
      classifications: validateHasManyRequired(),
      subSigns: validateHasManyOptional(),
      mainSigns: validateHasManyOptional(),
      relatedToRoadSignConcepts: validateHasManyOptional(),
      relatedFromRoadSignConcepts: validateHasManyOptional(),
      relatedRoadMarkingConcepts: validateHasManyOptional(),
      relatedTrafficLightConcepts: validateHasManyOptional(),
    });
  }
}
