import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsRoadsignConceptController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';

type Params = {
  id: string;
};

export default class RoadsignConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const data = await hash({
      roadSignConcept: this.store.findRecord('road-sign-concept', params.id),
      allSubSigns: this.store.query('road-sign-concept', {
        filter: {
          classifications: {
            label: 'Onderbord',
          },
        },
        page: {
          size: 10000,
        },
      }),
      classifications: this.store
        .findAll('road-sign-category')
        .then((classification) => {
          return classification.filter(({ label }) => label !== 'Onderbord');
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

    const relatedSubSigns = await data.roadSignConcept.subSigns;

    data.roadSignConcept.relatedRoadSignConcepts = new TrackedArray([
      // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
      ...(await data.roadSignConcept.relatedToRoadSignConcepts),
      // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
      ...(await data.roadSignConcept.relatedFromRoadSignConcepts),
    ]);

    return {
      ...data,
      allSubSigns: new TrackedArray(
        data.allSubSigns.filter((subSign) => {
          return (
            subSign.id !== data.roadSignConcept.id &&
            !relatedSubSigns.includes(subSign)
          );
        }),
      ),
    };
  }

  resetController(controller: RoadsignConceptsRoadsignConceptController) {
    controller.reset();
  }
}
