import Route from '@ember/routing/route';
import Store from 'mow-registry/services/store';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import { hash } from 'rsvp';
import { service } from '@ember/service';
import type RelatedController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept/related';
import type Transition from '@ember/routing/transition';
import { query } from '@warp-drive/legacy/compat/builders';

export default class RoadSignConceptsRoadSignConceptRelatedRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;

    return hash({
      roadSignConcept,
      allRoadSigns: this.store
        .request(
          query<RoadSignConceptModel>('road-sign-concept', {
            'filter[classifications][:not:label]': 'Onderbord',
            include: ['image.file'],
            page: {
              size: 10000,
            },
          }),
        )
        .then((res) => res.content),
    });
  }

  resetController(
    controller: RelatedController,
    isExiting: boolean,
    transition: Transition,
  ) {
    super.resetController(controller, isExiting, transition);

    controller.reset();
  }
}
