import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import RelatedRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { TrackedArray } from 'tracked-built-ins';

export default class RoadSignConceptsRoadSignConceptRelatedController extends Controller {
  declare model: ModelFrom<RelatedRoute>;
  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked relatedTrafficLightCodeFilter = '';
  @tracked classification: RoadSignCategory | null = null;
  @tracked classificationRoadSigns: RoadSignConcept[] | null = null;

  get isSidebarOpen() {
    return (
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedTrafficLights
    );
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

  setRelatedRoadMarkingCodeFilter = (event: InputEvent) => {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  };

  setRelatedTrafficLightCodeFilter = (event: InputEvent) => {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  };

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedToRoadSignConcepts =
      await this.model.roadSignConcept.relatedToRoadSignConcepts;
    const relatedRoadSignConcepts =
      this.model.roadSignConcept.relatedRoadSignConcepts;

    relatedToRoadSignConcepts.push(relatedRoadSign);
    relatedRoadSignConcepts.push(relatedRoadSign);

    await this.model.roadSignConcept.save();
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

    await relatedRoadSign.save();
    await this.model.roadSignConcept.save();
  });

  addRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConcept) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;

      relatedRoadMarkings.push(relatedRoadMarking);
      await relatedRoadMarking.save();
    },
  );

  removeRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConcept) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;
      removeItem(relatedRoadMarkings, relatedRoadMarking);
      await relatedRoadMarking.save();
    },
  );

  addRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConcept) => {
      const relatedTrafficLights =
        await this.model.roadSignConcept.relatedTrafficLightConcepts;

      relatedTrafficLights.push(relatedTrafficLight);
      await this.model.roadSignConcept.save();
    },
  );

  removeRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedTrafficLights =
      await this.model.roadSignConcept.relatedTrafficLightConcepts;

    removeItem(relatedTrafficLights, relatedTrafficLight);

    await this.model.roadSignConcept.save();
  });

  handleCategorySelection = task(
    async (classification: RoadSignCategory | null) => {
      if (classification) {
        this.classification = classification;
        // TODO: this only returns the first 20 records, we should use a query instead
        const classificationRoadSigns = await classification.roadSignConcepts;
        const relatedRoadSigns =
          this.model.roadSignConcept.relatedRoadSignConcepts;
        const mainRoadSigns = await this.model.roadSignConcept.mainSigns;

        this.classificationRoadSigns = new TrackedArray(
          classificationRoadSigns.filter((roadSign) => {
            return (
              roadSign.id !== this.model.roadSignConcept.id &&
              !relatedRoadSigns?.includes(roadSign) &&
              !mainRoadSigns.includes(roadSign)
            );
          }),
        );
      } else {
        this.classification = null;
        this.classificationRoadSigns = null;
      }
    },
  );

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
    this.relatedRoadMarkingCodeFilter = '';
    this.relatedTrafficLightCodeFilter = '';
    this.classification = null;
    this.classificationRoadSigns = null;
  }
}
