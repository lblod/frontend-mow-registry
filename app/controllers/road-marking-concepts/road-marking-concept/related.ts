import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type Route from 'mow-registry/routes/road-marking-concepts/road-marking-concept/related';
import type Store from 'mow-registry/services/store';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedController extends Controller {
  @service declare store: Store;
  declare model: ModelFrom<Route>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked classificationRoadSigns?: RoadSignConcept[] | null;

  get isSidebarOpen() {
    return (
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedTrafficLights
    );
  }

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedToRoadMarkingConcepts =
      await this.model.roadMarkingConcept.relatedToRoadMarkingConcepts;
    const relatedRoadMarkingConcepts =
      this.model.roadMarkingConcept.relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.push(relatedRoadMarking);
    relatedRoadMarkingConcepts.push(relatedRoadMarking);

    await this.store.request(saveRecord(this.model.roadMarkingConcept));
  });

  removeRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConcept) => {
      const relatedToRoadMarkingConcepts =
        await this.model.roadMarkingConcept.relatedToRoadMarkingConcepts;
      const relatedFromRoadMarkingConcepts =
        await this.model.roadMarkingConcept.relatedFromRoadMarkingConcepts;
      const relatedRoadMarkingConcepts =
        this.model.roadMarkingConcept.relatedRoadMarkingConcepts;

      removeItem(relatedToRoadMarkingConcepts, relatedRoadMarking);
      removeItem(relatedFromRoadMarkingConcepts, relatedRoadMarking);
      removeItem(relatedRoadMarkingConcepts, relatedRoadMarking);

      await this.store.request(saveRecord(relatedRoadMarking));
      await this.store.request(saveRecord(this.model.roadMarkingConcept));
    },
  );

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedRoadSigns =
      await this.model.roadMarkingConcept.relatedRoadSignConcepts;

    relatedRoadSigns.push(relatedRoadSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, relatedRoadSign);
    }
    await this.store.request(saveRecord(this.model.roadMarkingConcept));
  });

  removeRelatedRoadSign = task(async (relatedRoadSign: RoadSignConcept) => {
    const relatedRoadSigns =
      await this.model.roadMarkingConcept.relatedRoadSignConcepts;

    removeItem(relatedRoadSigns, relatedRoadSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(relatedRoadSign);
    }

    await this.store.request(saveRecord(this.model.roadMarkingConcept));
  });

  addRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadMarkingConcept.relatedTrafficLightConcepts;

      relatedTrafficLights.push(relatedTrafficLight);
      await this.store.request(saveRecord(this.model.roadMarkingConcept));
    },
  );

  removeRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadMarkingConcept.relatedTrafficLightConcepts;

      removeItem(relatedTrafficLights, relatedTrafficLight);
      await this.store.request(saveRecord(this.model.roadMarkingConcept));
    },
  );

  toggleAddRelatedRoadSigns = () => {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  };

  toggleAddRelatedRoadMarkings = () => {
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = !this.isAddingRelatedRoadMarkings;
    this.isAddingRelatedTrafficLights = false;
  };

  toggleAddRelatedTrafficLights = () => {
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = !this.isAddingRelatedTrafficLights;
  };

  reset() {
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
  }
}
