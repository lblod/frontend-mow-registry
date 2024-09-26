import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConceptRoute from '../road-sign-concept';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports -- https://github.com/ember-cli/eslint-plugin-ember/issues/2156
import type Store from 'ember-data/store';
import { service } from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import type Transition from '@ember/routing/transition';
import type SubSignsController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept/sub-signs';

export default class RoadSignConceptsRoadSignConceptSubSignsRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConceptRoute>;

    const allSubSigns = await this.store.query<RoadSignConcept>(
      'road-sign-concept',
      {
        filter: {
          classifications: {
            label: 'Onderbord',
          },
        },
        page: {
          size: 10000,
        },
      },
    );

    const relatedSubSigns = await roadSignConcept.subSigns;

    return {
      roadSignConcept,
      allSubSigns: new TrackedArray(
        allSubSigns.filter((subSign) => {
          return (
            subSign.id !== roadSignConcept.id &&
            !relatedSubSigns.includes(subSign)
          );
        }),
      ),
    };
  }

  resetController(
    controller: SubSignsController,
    isExiting: boolean,
    transition: Transition,
  ) {
    super.resetController(controller, isExiting, transition);

    controller.reset();
  }
}
