import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};

export default class RoadmarkingConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      roadMarkingConcept: await this.store
        .request(
          findRecord<RoadMarkingConcept>('road-marking-concept', params.id, {
            include: [
              'shapes.dimensions.kind',
              'shapes.dimensions.unit',
              'shapes.classification',
              'default-shape.dimensions',
              'default-shape.classification',
              'image.file',
              'variables',
              'zonality.in-scheme.concepts',
              'in-scheme.concepts',
              'related-road-sign-concepts',
              'related-to-road-marking-concepts',
              'related-from-road-marking-concepts',
              'related-traffic-light-concepts',
              'has-instructions',
            ],
          }),
        )
        .then((res) => res.content),
    };
  }
}
