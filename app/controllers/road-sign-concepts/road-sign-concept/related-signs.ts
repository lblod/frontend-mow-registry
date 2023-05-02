import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRelatedSignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related-signs';

export default class RoadSignConceptsRoadSignConceptRelatedSignsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptRelatedSignsRoute>;

  get related() {
    return [
      ...this.model.relatedTo.toArray(),
      ...this.model.relatedFrom.toArray(),
    ];
  }
}
