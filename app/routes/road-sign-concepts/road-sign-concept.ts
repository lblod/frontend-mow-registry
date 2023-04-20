import Route from '@ember/routing/route';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import RoadsignConceptsRoadsignConceptController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept';

export type RoadsignConceptsRoadSignConceptRouteModel = Awaited<
  ReturnType<RoadsignConceptsRoadSignConceptRoute['model']>
>;

interface Params {
  id: string;
}

export default class RoadsignConceptsRoadSignConceptRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const roadSignConcept = await this.store.findRecord<'road-sign-concept'>(
      'road-sign-concept',
      params.id
    );
    const signCategories = await roadSignConcept.categories;
    const isSubSign = signCategories.any(
      (category) => category.label === 'Onderbord'
    );
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
      roadSignConcept,
      isSubSign,
      allSubSigns,
      categories,
      allRoadMarkings,
      allTrafficLights,
    };
  }

  resetController(controller: RoadsignConceptsRoadsignConceptController) {
    controller.reset();
  }
}
