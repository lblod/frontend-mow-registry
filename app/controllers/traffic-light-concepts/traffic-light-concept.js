import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service('router') router;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked category = null;
  @tracked categoryTrafficLights = null;
  @tracked categoryRoadMarkings = null;
  @tracked categoryRoadSigns = null;

  @tracked relatedTrafficLightCodeFilter = '';
  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate;

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
      return trafficLight.definition
        ?.toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase());
    });
  }

  get roadMarkings() {
    if (!this.relatedRoadMarkingCodeFilter) {
      return this.model.allRoadMarkings;
    }

    return this.model.allRoadMarkings.filter((roadMarking) => {
      return roadMarking.definition
        ?.toLowerCase()
        .includes(this.relatedRoadMarkingCodeFilter.toLowerCase());
    });
  }

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value;
  }

  addRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedToTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedToTrafficLightConcepts;
    const relatedTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedToTrafficLightConcepts.pushObject(relatedTrafficLight);
    relatedTrafficLightConcepts.pushObject(relatedTrafficLight);

    await this.model.trafficLightConcept.save();
  });

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    let relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.trafficLightConcept.save();
  });

  removeRelatedRoadSign = task(async (relatedRoadSign) => {
    let relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.trafficLightConcept.save();
  });

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    let relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.pushObject(relatedRoadMarking);
    this.model.trafficLightConcept.save();
  });

  removeRelatedRoadMarking = task(async (relatedRoadMarking) => {
    let relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.removeObject(relatedRoadMarking);

    this.model.trafficLightConcept.save();
  });

  handleCategorySelection = task(async (category) => {
    if (category) {
      this.category = category;
      let categoryRoadSigns = await category.roadSignConcepts;

      this.categoryRoadSigns = categoryRoadSigns;
    } else {
      this.category = null;
      this.categoryRoadSigns = null;
    }
  });

  removeRelatedTrafficLight = task(async (relatedTrafficLight) => {
    const relatedToTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedToTrafficLightConcepts;
    const relatedFromTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedFromTrafficLightConcepts;
    const relatedTrafficLightConcepts = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedToTrafficLightConcepts.removeObject(relatedTrafficLight);
    relatedFromTrafficLightConcepts.removeObject(relatedTrafficLight);
    relatedTrafficLightConcepts.removeObject(relatedTrafficLight);

    await relatedTrafficLight.save();
    await this.model.trafficLightConcept.save();
  });

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value;
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

  removeTrafficLightConcept = task(async (trafficLightConcept, event) => {
    event.preventDefault();

    await trafficLightConcept.destroyRecord();
    this.router.transitionTo('traffic-light-concepts');
  });

  @action
  addInstruction() {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      'new',
    );
  }

  updateInstruction = task(async () => {
    this.editedTemplate.value = this.newDescription;
    await this.editedTemplate.save();
    this.resetInstruction();
  });

  @action editInstruction(template) {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      template.id,
    );
  }

  get hasActiveChildRoute() {
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
    this.toggleInstructions();
  }

  removeTemplate = task(async (template) => {
    let templates = await this.model.trafficLightConcept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.model.trafficLightConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedTrafficLights = false;
    this.isOpen = false;
    // this.category = null;
    // this.categoryTrafficLights = null;
  }
}
