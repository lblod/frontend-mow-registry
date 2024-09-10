import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RoadsignConceptsRoadsignConceptController from 'mow-registry/controllers/road-sign-concepts/road-sign-concept';
import { hash } from 'rsvp';
import { TrackedArray } from 'tracked-built-ins';
import type RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';

type Params = {
  id: string;
};

export default class RoadsignConcept extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const data = await hash({
      roadSignConcept: this.store.findRecord<RoadSignConceptModel>(
        'road-sign-concept',
        params.id,
      ),
      allSubSigns: this.store.query<RoadSignConceptModel>('road-sign-concept', {
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
        .findAll<RoadSignCategory>('road-sign-category')
        .then((classification) => {
          return classification.filter(({ label }) => label !== 'Onderbord');
        }),
      allRoadMarkings: this.store.query<RoadMarkingConcept>(
        'road-marking-concept',
        {
          page: {
            size: 10000,
          },
        },
      ),
      allTrafficLights: this.store.query<TrafficLightConcept>(
        'traffic-light-concept',
        {
          page: {
            size: 10000,
          },
        },
      ),
    });

    const relatedSubSigns = await data.roadSignConcept.subSigns;

    data.roadSignConcept.relatedRoadSignConcepts = new TrackedArray([
      ...(await data.roadSignConcept.relatedToRoadSignConcepts),
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
