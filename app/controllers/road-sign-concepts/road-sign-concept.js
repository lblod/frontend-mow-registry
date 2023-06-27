import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service router;

  @tracked isAddingSubSigns = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked category = null;
  @tracked categoryRoadSigns = null;

  @tracked subSignCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate;
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked relatedTrafficLightCodeFilter = '';

  @tracked isSubSign = false;

  @action
  async didInsert() {
    this.isSubSign =
      (await this.model.roadSignConcept.categories).filter((category) => {
        return category.label === 'Onderbord';
      }).length === 1;
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
      return subSign.roadSignConceptCode
        .toLowerCase()
        .includes(this.subSignCodeFilter.toLowerCase());
    });
  }

  get roadMarkings() {
    if (!this.relatedRoadMarkingCodeFilter) {
      return this.model.allRoadMarkings;
    }

    return this.model.allRoadMarkings.filter((roadMarking) => {
      return roadMarking.definition
        .toLowerCase()
        .includes(this.relatedRoadMarkingCodeFilter.toLowerCase());
    });
  }

  get trafficLights() {
    if (!this.relatedTrafficLightCodeFilter) {
      return this.model.allTrafficLights;
    }

    return this.model.allTrafficLights.filter((trafficLight) => {
      return trafficLight.definition
        .toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase());
    });
  }

  @action
  setSubSignCodeFilter(event) {
    this.subSignCodeFilter = event.target.value;
  }

  addSubSign = task(async (subSign) => {
    let subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.pushObject(subSign);
    this.model.allSubSigns.removeObject(subSign);
    this.model.roadSignConcept.save();
  });

  removeSubSign = task(async (subSign) => {
    let subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.removeObject(subSign);
    this.model.allSubSigns.pushObject(subSign);
    this.model.roadSignConcept.save();
  });

  @action
  setMainSignCodeFilter(event) {
    this.mainSignCodeFilter = event.target.value;
  }

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value;
  }

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value;
  }

  addMainSign = task(async (mainSign) => {
    let mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.pushObject(mainSign);
    this.categoryRoadSigns.removeObject(mainSign);
    this.model.roadSignConcept.save();
  });

  removeMainSign = task(async (mainSign) => {
    let mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.removeObject(mainSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(mainSign);
    }

    this.model.roadSignConcept.save();
  });

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedToRoadSignConcepts = await this.model.roadSignConcept
      .relatedToRoadSignConcepts;
    const relatedRoadSignConcepts = await this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedToRoadSignConcepts.pushObject(relatedRoadSign);
    relatedRoadSignConcepts.pushObject(relatedRoadSign);

    await this.model.roadSignConcept.save();
  });

  removeRelatedRoadSign = task(async (relatedRoadSign) => {
    const relatedToRoadSignConcepts = await this.model.roadSignConcept
      .relatedToRoadSignConcepts;
    const relatedFromRoadSignConcepts = await this.model.roadSignConcept
      .relatedFromRoadSignConcepts;
    const relatedRoadSignConcepts = await this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedToRoadSignConcepts.removeObject(relatedRoadSign);
    relatedFromRoadSignConcepts.removeObject(relatedRoadSign);
    relatedRoadSignConcepts.removeObject(relatedRoadSign);

    await relatedRoadSign.save();
    await this.model.roadSignConcept.save();
  });

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    let relatedRoadMarkings = await this.model.roadSignConcept
      .relatedRoadMarkingConcepts;
    relatedRoadMarkings.pushObject(relatedRoadMarking);
    await relatedRoadMarking.save();
  });

  removeRelatedRoadMarking = task(async (relatedRoadMarking) => {
    let relatedRoadMarkings = await this.model.roadSignConcept
      .relatedRoadMarkingConcepts;
    relatedRoadMarkings.removeObject(relatedRoadMarking);
    await relatedRoadMarking.save();
  });

  addRelatedTrafficLight = task(async (relatedTrafficLight) => {
    let relatedTrafficLights = await this.model.roadSignConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    this.model.roadSignConcept.save();
  });

  removeRelatedTrafficLight = task(async (relatedTrafficLight) => {
    let relatedTrafficLights = await this.model.roadSignConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    this.model.roadSignConcept.save();
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

  handleCategorySelection = task(async (category) => {
    if (category) {
      this.category = category;
      let categoryRoadSigns = await category.roadSignConcepts;
      let relatedRoadSigns = await this.model.roadSignConcept
        .relatedRoadSignConcepts;
      let mainRoadSigns = await this.model.roadSignConcept.mainSigns;

      this.categoryRoadSigns = categoryRoadSigns.filter((roadSign) => {
        return (
          roadSign.id !== this.model.roadSignConcept.id &&
          !relatedRoadSigns.includes(roadSign) &&
          !mainRoadSigns.includes(roadSign)
        );
      });
    } else {
      this.category = null;
      this.categoryRoadSigns = null;
    }
  });

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'road-sign-concepts.road-sign-concept.instruction'
    );
  }

  removeRoadSignConcept = task(async (roadSignConcept, event) => {
    event.preventDefault();

    await roadSignConcept.destroyRecord();
    this.router.transitionTo('road-sign-concepts');
  });

  @action
  addInstruction() {
    this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.instruction',
      'new'
    );
  }

  @action
  editInstruction(template) {
    this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.instruction',
      template.id
    );
  }

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith(
        'road-sign-concepts.road-sign-concept'
      ) &&
      this.router.currentRouteName !==
        'road-sign-concepts.road-sign-concept.index'
    );
  }

  removeTemplate = task(async (template) => {
    let templates = await this.model.roadSignConcept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.model.roadSignConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadSigns = false;
    this.isOpen = false;
    this.category = null;
    this.categoryRoadSigns = null;
  }
}
