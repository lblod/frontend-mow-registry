import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports -- https://github.com/ember-cli/eslint-plugin-ember/issues/2156
import type Store from 'ember-data/store';
import { service } from '@ember/service';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type MainSignsController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept/main-signs';
import type Transition from '@ember/routing/transition';

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;

    return {
      roadSignConcept,
      classifications: await this.store
        .findAll<RoadSignCategory>('road-sign-category')
        .then((classification) => {
          // TODO: use the uri/id instead of the label
          return classification.filter(({ label }) => label !== 'Onderbord');
        }),
    };
  }

  resetController(
    controller: MainSignsController,
    isExiting: boolean,
    transition: Transition,
  ) {
    super.resetController(controller, isExiting, transition);

    controller.reset();
  }
}
