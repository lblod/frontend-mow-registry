import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const { mainConcept, isSubSign } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadSignConceptsRoadSignConceptRoute>;
    const allSubSigns = await this.store.query('road-sign-concept', {
      filter: {
        categories: {
          label: 'Onderbord',
        },
      },
      page: {
        size: 10000,
      },
    });
    const categories = await this.store
      .findAll('road-sign-category')
      .then((category) => {
        return category.filter(({ label }) => label !== 'Onderbord');
      });
    const allRoadMarkings = await this.store.query('road-marking-concept', {
      page: {
        size: 10000,
      },
    });
    const allTrafficLights = await this.store.query('traffic-light-concept', {
      page: {
        size: 10000,
      },
    });

    return {
      mainConcept,
      isSubSign,
      allSubSigns,
      categories,
      allRoadMarkings,
      allTrafficLights,
    };
  }
}
