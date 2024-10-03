import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type Route from 'mow-registry/routes/road-marking-concepts/road-marking-concept/related';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedController extends Controller {
  @service declare router: RouterService;
  declare model: ModelFrom<Route>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked classification?: RoadSignCategory | null;
  @tracked classificationRoadMarkings = null;
  @tracked classificationRoadSigns?: RoadSignConcept[] | null;

  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';
  @tracked relatedTrafficLightCodeFilter = '';

  get isSidebarOpen() {
    return (
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedTrafficLights
    );
  }

  get roadMarkings() {
    if (!this.relatedRoadMarkingCodeFilter.trim()) {
      return this.model.allRoadMarkings;
    }

    return this.model.allRoadMarkings.filter((roadMarking) => {
      return roadMarking.meaning
        ?.toLowerCase()
        .includes(this.relatedRoadMarkingCodeFilter.toLowerCase().trim());
    });
  }

  get trafficLights() {
    if (!this.relatedTrafficLightCodeFilter.trim()) {
      return this.model.allTrafficLights;
    }

    return this.model.allTrafficLights.filter((trafficLight) => {
      return trafficLight.meaning
        ?.toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase().trim());
    });
  }

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedToRoadMarkingConcepts =
      await this.model.roadMarkingConcept.relatedToRoadMarkingConcepts;
    const relatedRoadMarkingConcepts =
      this.model.roadMarkingConcept.relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.push(relatedRoadMarking);
    relatedRoadMarkingConcepts.push(relatedRoadMarking);

    await this.model.roadMarkingConcept.save();
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

      await relatedRoadMarking.save();
      await this.model.roadMarkingConcept.save();
    },
  );

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedRoadSigns =
      await this.model.roadMarkingConcept.relatedRoadSignConcepts;

    relatedRoadSigns.push(relatedRoadSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, relatedRoadSign);
    }
    await this.model.roadMarkingConcept.save();
  });

  removeRelatedRoadSign = task(async (relatedRoadSign: RoadSignConcept) => {
    const relatedRoadSigns =
      await this.model.roadMarkingConcept.relatedRoadSignConcepts;

    removeItem(relatedRoadSigns, relatedRoadSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(relatedRoadSign);
    }

    await this.model.roadMarkingConcept.save();
  });

  handleCategorySelection = task(
    async (classification: RoadSignCategory | null) => {
      if (classification) {
        this.classification = classification;
        const classificationRoadSigns = await classification.roadSignConcepts;

        this.classificationRoadSigns = classificationRoadSigns;
      } else {
        this.classification = null;
        this.classificationRoadSigns = null;
      }
    },
  );

  addRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadMarkingConcept.relatedTrafficLightConcepts;

      relatedTrafficLights.push(relatedTrafficLight);
      await this.model.roadMarkingConcept.save();
    },
  );

  removeRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadMarkingConcept.relatedTrafficLightConcepts;

      removeItem(relatedTrafficLights, relatedTrafficLight);

      await this.model.roadMarkingConcept.save();
    },
  );

  setRelatedRoadMarkingCodeFilter = (event: InputEvent) => {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value.trim();
  };

  setRelatedTrafficLightCodeFilter = (event: InputEvent) => {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value.trim();
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
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.classification = null;
    this.classificationRoadMarkings = null;
  }
}
