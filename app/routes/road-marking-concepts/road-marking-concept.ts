import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';

type Params = {
  id: string;
};

export default class RoadmarkingConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      roadMarkingConcept: await this.store.findRecord<RoadMarkingConcept>(
        'road-marking-concept',
        params.id,
      ),
    };
  }
}
