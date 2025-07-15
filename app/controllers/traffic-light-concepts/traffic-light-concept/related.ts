import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type TrafficlightConceptRelatedRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept/related';
import { removeItem } from 'mow-registry/utils/array';
import type Store from 'mow-registry/services/store';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

export default class TrafficLightConceptsTrafficLightConceptRelatedController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;
  declare model: ModelFrom<TrafficlightConceptRelatedRoute>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked classification: RoadSignCategory | null = null;
  @tracked classificationTrafficLights = null;
  @tracked classificationRoadMarkings = null;
  @tracked classificationRoadSigns: RoadSignConcept[] | null = null;

  @tracked relatedTrafficLightCodeFilter = '';
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';

  get isSidebarOpen() {
    return (
      this.isAddingRelatedTrafficLights ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings
    );
  }

  get trafficLights() {
    if (!this.relatedTrafficLightCodeFilter) {
      return this.model.allTrafficLights;
    }

    return this.model.allTrafficLights.filter((trafficLight) => {
      return trafficLight.meaning
        ?.toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase());
    });
  }

  get roadMarkings() {
    if (!this.relatedRoadMarkingCodeFilter) {
      return this.model.allRoadMarkings;
    }

    return this.model.allRoadMarkings.filter((roadMarking) => {
      return roadMarking.meaning
        ?.toLowerCase()
        .includes(this.relatedRoadMarkingCodeFilter.toLowerCase());
    });
  }

  setRelatedTrafficLightCodeFilter = (event: InputEvent) => {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  };

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

  handleCategorySelection = task(async (classification: RoadSignCategory) => {
    if (classification) {
      this.classification = classification;
      const classificationRoadSigns = await classification.roadSignConcepts;

      this.classificationRoadSigns = classificationRoadSigns;
    } else {
      this.classification = null;
      this.classificationRoadSigns = null;
    }
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

  setRelatedRoadMarkingCodeFilter = (event: InputEvent) => {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  };

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
