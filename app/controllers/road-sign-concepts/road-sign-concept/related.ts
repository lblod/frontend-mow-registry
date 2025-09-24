import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import RelatedRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related';
import type Store from 'mow-registry/services/store';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadSignConceptsRoadSignConceptRelatedController extends Controller {
  @service declare store: Store;

  declare model: ModelFrom<RelatedRoute>;
  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  get isSidebarOpen() {
    return (
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedTrafficLights
    );
  }

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedToRoadSignConcepts =
      await this.model.roadSignConcept.relatedToRoadSignConcepts;
    const relatedRoadSignConcepts =
      this.model.roadSignConcept.relatedRoadSignConcepts;

    relatedToRoadSignConcepts.push(relatedRoadSign);
    relatedRoadSignConcepts.push(relatedRoadSign);
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  removeRelatedRoadSign = task(async (relatedRoadSign: RoadSignConcept) => {
    const relatedToRoadSignConcepts =
      await this.model.roadSignConcept.relatedToRoadSignConcepts;
    const relatedFromRoadSignConcepts =
      await this.model.roadSignConcept.relatedFromRoadSignConcepts;
    const relatedRoadSignConcepts =
      this.model.roadSignConcept.relatedRoadSignConcepts;

    removeItem(relatedToRoadSignConcepts, relatedRoadSign);
    removeItem(relatedFromRoadSignConcepts, relatedRoadSign);
    removeItem(relatedRoadSignConcepts, relatedRoadSign);

    await this.store.request(saveRecord(relatedRoadSign));
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  addRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConcept) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;

      relatedRoadMarkings.push(relatedRoadMarking);
      await this.store.request(saveRecord(relatedRoadMarking));
    },
  );

  removeRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConcept) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;
      removeItem(relatedRoadMarkings, relatedRoadMarking);

      await this.store.request(saveRecord(relatedRoadMarking));
    },
  );

  addRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadSignConcept.relatedTrafficLightConcepts;

      relatedTrafficLights.push(relatedTrafficLight);

      await this.store.request(saveRecord(this.model.roadSignConcept));
    },
  );

  removeRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedTrafficLights =
      await this.model.roadSignConcept.relatedTrafficLightConcepts;

    removeItem(relatedTrafficLights, relatedTrafficLight);

    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  toggleAddRelatedRoadSigns = () => {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  };

  toggleAddRelatedRoadMarkings = () => {
    this.isAddingRelatedRoadMarkings = !this.isAddingRelatedRoadMarkings;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedTrafficLights = false;
  };

  toggleAddRelatedTrafficLights = () => {
    this.isAddingRelatedTrafficLights = !this.isAddingRelatedTrafficLights;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
  };

  reset() {
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  }
}
