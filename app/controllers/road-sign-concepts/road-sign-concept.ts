import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import TemplateModel from 'mow-registry/models/template';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import RoadsignConcept from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import { removeItem } from 'mow-registry/utils/array';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { TrackedArray } from 'tracked-built-ins';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service declare router: RouterService;
  declare model: ModelFrom<RoadsignConcept>;

  @tracked isAddingSubSigns = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked classification: RoadSignCategoryModel | null = null;
  @tracked classificationRoadSigns: RoadSignConceptModel[] | null = null;

  @tracked subSignCodeFilter = '';
  @tracked mainSignCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate = null;
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked relatedTrafficLightCodeFilter = '';

  @tracked isSubSign = false;

  @action
  async didInsert() {
    this.isSubSign =
      (await this.model.roadSignConcept.classifications).filter(
        (classification) => {
          return classification.label === 'Onderbord';
        },
      ).length === 1;
  }

  get showSidebar() {
    return (
      this.isAddingRelatedRoadSigns ||
      this.isAddingMainSigns ||
      this.isAddingSubSigns ||
      this.hasActiveChildRoute ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedTrafficLights
    );
  }

  get subSigns() {
    if (!this.subSignCodeFilter) {
      return this.model.allSubSigns;
    }

    return this.model.allSubSigns.filter((subSign) => {
      return subSign.label
        ?.toLowerCase()
        .includes(this.subSignCodeFilter.toLowerCase());
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

  @action
  setSubSignCodeFilter(event: InputEvent) {
    this.subSignCodeFilter = (event.target as HTMLInputElement).value;
  }

  addSubSign = task(async (subSign) => {
    const subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.push(subSign);
    removeItem(this.model.allSubSigns, subSign);
    await this.model.roadSignConcept.save();
  });

  removeSubSign = task(async (subSign) => {
    const subSigns = await this.model.roadSignConcept.subSigns;
    removeItem(subSigns, subSign);
    this.model.allSubSigns.push(subSign);
    await this.model.roadSignConcept.save();
  });

  @action
  setMainSignCodeFilter(event: InputEvent) {
    this.mainSignCodeFilter = (event.target as HTMLInputElement).value;
  }

  @action
  setRelatedRoadMarkingCodeFilter(event: InputEvent) {
    this.relatedRoadMarkingCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  }

  @action
  setRelatedTrafficLightCodeFilter(event: InputEvent) {
    this.relatedTrafficLightCodeFilter = (
      event.target as HTMLInputElement
    ).value;
  }

  addMainSign = task(async (mainSign: RoadSignConceptModel) => {
    const mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.push(mainSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, mainSign);
    }
    await this.model.roadSignConcept.save();
  });

  removeMainSign = task(async (mainSign) => {
    const mainSigns = await this.model.roadSignConcept.mainSigns;

    removeItem(mainSigns, mainSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(mainSign);
    }

    await this.model.roadSignConcept.save();
  });

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedToRoadSignConcepts =
      await this.model.roadSignConcept.relatedToRoadSignConcepts;
    const relatedRoadSignConcepts =
      this.model.roadSignConcept.relatedRoadSignConcepts;

    relatedToRoadSignConcepts.push(relatedRoadSign);
    relatedRoadSignConcepts.push(relatedRoadSign);

    await this.model.roadSignConcept.save();
  });

  removeRelatedRoadSign = task(
    async (relatedRoadSign: RoadSignConceptModel) => {
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
    },
  );

  addRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConceptModel) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;

      relatedRoadMarkings.push(relatedRoadMarking);
      await relatedRoadMarking.save();
    },
  );

  removeRelatedRoadMarking = task(
    async (relatedRoadMarking: RoadMarkingConceptModel) => {
      const relatedRoadMarkings =
        await this.model.roadSignConcept.relatedRoadMarkingConcepts;
      removeItem(relatedRoadMarkings, relatedRoadMarking);
      await relatedRoadMarking.save();
    },
  );

  addRelatedTrafficLight = task(
    async (relatedTrafficLight: TrafficLightConceptModel) => {
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

  @action
  toggleAddSubSigns() {
    this.isAddingSubSigns = !this.isAddingSubSigns;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.subSignCodeFilter = '';
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddMainSigns() {
    this.isAddingMainSigns = !this.isAddingMainSigns;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingSubSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.mainSignCodeFilter = '';
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddRelatedRoadSigns() {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddRelatedRoadMarkings() {
    this.isAddingRelatedRoadMarkings = !this.isAddingRelatedRoadMarkings;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedTrafficLights = false;
  }

  @action
  toggleAddRelatedTrafficLights() {
    this.isAddingRelatedTrafficLights = !this.isAddingRelatedTrafficLights;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingRelatedRoadMarkings = false;
  }

  handleCategorySelection = task(
    async (classification: RoadSignCategoryModel) => {
      if (classification) {
        this.classification = classification;
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

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'road-sign-concepts.road-sign-concept.instruction'
    );
  }

  removeRoadSignConcept = task(
    async (roadSignConcept: RoadSignConceptModel, event: InputEvent) => {
      event.preventDefault();
      await Promise.all(
        roadSignConcept.shapes.map(async (shape) => {
          await Promise.all(
            shape.dimensions.map(async (dimension) => {
              await dimension.destroyRecord();
            }),
          );
          await shape.destroyRecord();
        }),
      );
      await roadSignConcept.destroyRecord();
      await this.router.transitionTo('road-sign-concepts');
    },
  );

  @action
  async addInstruction() {
    await this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.instruction',
      'new',
    );
  }

  @action
  async editInstruction(template: TemplateModel) {
    await this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.instruction',
      template.id,
    );
  }

  get hasActiveChildRoute(): boolean {
    return (
      this.router.currentRouteName.startsWith(
        'road-sign-concepts.road-sign-concept',
      ) &&
      this.router.currentRouteName !==
        'road-sign-concepts.road-sign-concept.index'
    );
  }

  removeTemplate = task(async (template: TemplateModel) => {
    const templates = await this.model.roadSignConcept.hasInstructions;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.model.roadSignConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadSigns = false;
    this.isOpen = false;
    this.classification = null;
    this.classificationRoadSigns = null;
  }
}
