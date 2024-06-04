import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsRoadsignConceptController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};

export default class RoadsignConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = await hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      allSubSigns: this.store
        .query('road-sign-concept', {
          filter: {
            classifications: {
              label: 'Onderbord',
            },
          },
          page: {
            size: 10000,
          },
        })
        .then((subsigns) => subsigns.slice()),
      classifications: this.store
        .findAll('road-sign-category')
        .then((category) => {
          return category.filter(({ label }) => label !== 'Onderbord');
        }),
      allRoadMarkings: this.store.query('road-marking-concept', {
        page: {
          size: 10000,
        },
      }),
      allTrafficLights: this.store.query('traffic-light-concept', {
        page: {
          size: 10000,
        },
      }),
    });

    const relatedSubSigns = await model.roadSignConcept.subSigns;
    model.allSubSigns = model.allSubSigns.filter((subSign) => {
      return (
        subSign.id !== model.roadSignConcept.id &&
        !relatedSubSigns.includes(subSign)
      );
    });

    model.roadSignConcept.relatedRoadSignConcepts = [];
    model.roadSignConcept.relatedRoadSignConcepts
      .addObjects(await model.roadSignConcept.relatedToRoadSignConcepts)
      .addObjects(await model.roadSignConcept.relatedFromRoadSignConcepts);

    return model;
  }

  resetController(controller: RoadsignConceptsRoadsignConceptController) {
    controller.reset();
  }
}
