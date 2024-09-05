import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficlightConcept from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import TemplateModel from 'mow-registry/models/template';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import { removeItem } from 'mow-registry/utils/array';

export default class TrafficLightConceptsTrafficLightConceptController extends Controller {
  @service declare router: RouterService;
  declare model: ModelFrom<TrafficlightConcept>;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingSubSigns = false;

  @tracked classification: RoadSignCategoryModel | null = null;
  @tracked classificationTrafficLights = null;
  @tracked classificationRoadMarkings = null;
  @tracked classificationRoadSigns: RoadSignConceptModel[] | null = null;

  @tracked relatedTrafficLightCodeFilter = '';
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate: TemplateModel | null = null;

  get showSidebar() {
    return (
      this.isAddingRelatedTrafficLights ||
      this.isAddingMainSigns ||
      this.hasActiveChildRoute ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingSubSigns
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

  @action
  setRelatedTrafficLightCodeFilter(event: InputEvent) {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  }

  addRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedToTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedToTrafficLightConcepts;
    const relatedTrafficLightConcepts =
      this.model.trafficLightConcept.relatedTrafficLightConcepts;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    relatedToTrafficLightConcepts.push(relatedTrafficLight);
    relatedTrafficLightConcepts.push(relatedTrafficLight);

    await this.model.trafficLightConcept.save();
  });

  addRelatedRoadSign = task(async (relatedRoadSign: RoadSignConceptModel) => {
    const relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    relatedRoadSigns.push(relatedRoadSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, relatedRoadSign);
    }
    await this.model.trafficLightConcept.save();
  });

  removeRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    removeItem(relatedRoadSigns, relatedRoadSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(relatedRoadSign);
    }

    await this.model.trafficLightConcept.save();
  });

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    relatedRoadMarkings.push(relatedRoadMarking);
    await this.model.trafficLightConcept.save();
  });

  removeRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    removeItem(relatedRoadMarkings, relatedRoadMarking);

    await this.model.trafficLightConcept.save();
  });

  handleCategorySelection = task(
    async (classification: RoadSignCategoryModel) => {
      if (classification) {
        this.classification = classification;
        const classificationRoadSigns = await classification.roadSignConcepts;

        // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.classificationRoadSigns = classificationRoadSigns;
      } else {
        this.classification = null;
        this.classificationRoadSigns = null;
      }
    },
  );

  removeRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConceptModel) => {
      const relatedToTrafficLightConcepts = await this.model.trafficLightConcept
        .relatedToTrafficLightConcepts;
      const relatedFromTrafficLightConcepts = await this.model
        .trafficLightConcept.relatedFromTrafficLightConcepts;
      const relatedTrafficLightConcepts =
        this.model.trafficLightConcept.relatedTrafficLightConcepts;

      // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      removeItem(relatedToTrafficLightConcepts, relatedTrafficLight);
      // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      removeItem(relatedFromTrafficLightConcepts, relatedTrafficLight);
      removeItem(relatedTrafficLightConcepts, relatedTrafficLight);

      await relatedTrafficLight.save();
      await this.model.trafficLightConcept.save();
    },
  );

  @action
  setRelatedRoadMarkingCodeFilter(event: InputEvent) {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value;
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

  removeTrafficLightConcept = task(
    async (
      trafficLightConcept: TrafficLightConceptModel,
      event: InputEvent,
    ) => {
      event.preventDefault();

      await trafficLightConcept.destroyRecord();
      await this.router.transitionTo('traffic-light-concepts');
    },
  );

  @action
  async addInstruction() {
    await this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      'new',
    );
  }

  updateInstruction = task(async () => {
    if (this.editedTemplate) {
      this.editedTemplate.value = this.newDescription;
      await this.editedTemplate.save();
    }
    this.resetInstruction();
  });

  @action async editInstruction(template: TemplateModel) {
    await this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      template.id,
    );
  }

  get hasActiveChildRoute(): boolean {
    return (
      this.router.currentRouteName.startsWith(
        'traffic-light-concepts.traffic-light-concept',
      ) &&
      this.router.currentRouteName !==
        'traffic-light-concepts.traffic-light-concept.index'
    );
  }

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'traffic-light-concepts.traffic-light-concept.instruction'
    );
  }

  @action
  resetInstruction() {
    this.newDescription = '';
    this.editedTemplate = null;
  }

  removeTemplate = task(async (template: TemplateModel) => {
    const templates = await this.model.trafficLightConcept.hasInstructions;

    // @ts-expect-error: awaited async hasMany relationship act like arrays, so this code is valid. The types are wrong.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    removeItem(templates, template);

    await template.destroyRecord();
    await this.model.trafficLightConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedTrafficLights = false;
    this.isOpen = false;
    // this.classification = null;
    // this.classificationTrafficLights = null;
  }
}
