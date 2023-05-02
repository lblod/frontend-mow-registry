import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadMarkingConceptsRoadMarkingConceptRelatedMarkingsRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept/related-markings';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedMarkingsController extends Controller {
  declare model: ModelFrom<RoadMarkingConceptsRoadMarkingConceptRelatedMarkingsRoute>;

  get related() {
    return [
      ...this.model.relatedTo.toArray(),
      ...this.model.relatedFrom.toArray(),
    ];
  }
}
