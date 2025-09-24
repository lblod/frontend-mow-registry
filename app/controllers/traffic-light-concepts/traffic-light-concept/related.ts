import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type TrafficlightConceptRelatedRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept/related';
import { removeItem } from 'mow-registry/utils/array';
import type Store from 'mow-registry/services/store';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

export default class TrafficLightConceptsTrafficLightConceptRelatedController extends Controller {
  @service declare store: Store;
  declare model: ModelFrom<TrafficlightConceptRelatedRoute>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked classificationRoadSigns: RoadSignConcept[] | null = null;

  get isSidebarOpen() {
    return (
      this.isAddingRelatedTrafficLights ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings
    );
  }

  addRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedToTrafficLightConcepts =
      await this.model.trafficLightConcept.relatedToTrafficLightConcepts;
    const relatedTrafficLightConcepts =
      this.model.trafficLightConcept.relatedTrafficLightConcepts;

    relatedToTrafficLightConcepts.push(relatedTrafficLight);
    relatedTrafficLightConcepts.push(relatedTrafficLight);

    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });

  addRelatedRoadSign = task(async (relatedRoadSign: RoadSignConcept) => {
    const relatedRoadSigns =
      await this.model.trafficLightConcept.relatedRoadSignConcepts;

    relatedRoadSigns.push(relatedRoadSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, relatedRoadSign);
    }
    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });

  removeRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedRoadSigns =
      await this.model.trafficLightConcept.relatedRoadSignConcepts;

    removeItem(relatedRoadSigns, relatedRoadSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(relatedRoadSign);
    }

    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedRoadMarkings =
      await this.model.trafficLightConcept.relatedRoadMarkingConcepts;

    relatedRoadMarkings.push(relatedRoadMarking);
    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });

  removeRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedRoadMarkings =
      await this.model.trafficLightConcept.relatedRoadMarkingConcepts;

    removeItem(relatedRoadMarkings, relatedRoadMarking);

    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });

  removeRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedToTrafficLightConcepts =
        await this.model.trafficLightConcept.relatedToTrafficLightConcepts;
      const relatedFromTrafficLightConcepts =
        await this.model.trafficLightConcept.relatedFromTrafficLightConcepts;
      const relatedTrafficLightConcepts =
        this.model.trafficLightConcept.relatedTrafficLightConcepts;

      removeItem(relatedToTrafficLightConcepts, relatedTrafficLight);
      removeItem(relatedFromTrafficLightConcepts, relatedTrafficLight);
      removeItem(relatedTrafficLightConcepts, relatedTrafficLight);

      await this.store.request(saveRecord(relatedTrafficLight));
      await this.store.request(saveRecord(this.model.trafficLightConcept));
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
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  }
}
