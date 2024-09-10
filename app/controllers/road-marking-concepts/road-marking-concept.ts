import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import Template from 'mow-registry/models/template';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import RoadmarkingConcept from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { removeItem } from 'mow-registry/utils/array';
import { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadmarkingConceptsRoadmarkingConceptController extends Controller {
  @service declare router: RouterService;
  declare model: ModelFrom<RoadmarkingConcept>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked classification?: RoadSignCategory | null;
  @tracked classificationRoadMarkings = null;
  @tracked classificationRoadSigns?: RoadSignConcept[] | null;

  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate = null;
  @tracked relatedTrafficLightCodeFilter = '';

  get showSidebar() {
    return (
      this.hasActiveChildRoute ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedTrafficLights
    );
  }

  get hasActiveChildRoute(): boolean {
    const currentRouteName = this.router.currentRouteName;
    return (
      !!currentRouteName &&
      currentRouteName.startsWith(
        'road-marking-concepts.road-marking-concept',
      ) &&
      currentRouteName !== 'road-marking-concepts.road-marking-concept.index'
    );
  }

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'road-marking-concepts.road-marking-concept.instruction'
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

  @action
  setRelatedRoadMarkingCodeFilter(event: InputEvent) {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value.trim();
  }

  @action
  setRelatedTrafficLightCodeFilter(event: InputEvent) {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value.trim();
  }

  @action
  toggleAddRelatedRoadSigns() {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddRelatedRoadMarkings() {
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = !this.isAddingRelatedRoadMarkings;
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddRelatedTrafficLights() {
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = !this.isAddingRelatedTrafficLights;
  }

  removeRoadMarkingConcept = task(
    async (roadMarkingConcept: RoadMarkingConcept, event: InputEvent) => {
      event.preventDefault();

      await roadMarkingConcept.destroyRecord();
      await this.router.transitionTo('road-marking-concepts');
    },
  );

  @action
  async addInstruction() {
    await this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      'new',
    );
  }

  @action
  async editInstruction(template: Template) {
    await this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      template.id,
    );
  }

  removeTemplate = task(async (template: Template) => {
    const templates = await this.model.roadMarkingConcept.hasInstructions;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.model.roadMarkingConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.isOpen = false;
    this.classification = null;
    this.classificationRoadMarkings = null;
  }
}
