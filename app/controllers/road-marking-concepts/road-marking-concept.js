import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class RoadmarkingConceptsRoadmarkingConceptController extends Controller {
  @service router;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked category = null;
  @tracked categoryRoadMarkings = null;
  @tracked categoryRoadSigns = null;

  @tracked relatedRoadMarkingCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate;
  @tracked relatedTrafficLightCodeFilter = '';

  get showSidebar() {
    return (
      this.hasActiveChildRoute ||
      this.isAddingRelatedRoadSigns ||
      this.isAddingRelatedRoadMarkings ||
      this.isAddingRelatedTrafficLights
    );
  }

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith(
        'road-marking-concepts.road-marking-concept',
      ) &&
      this.router.currentRouteName !==
        'road-marking-concepts.road-marking-concept.index'
    );
  }

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'road-marking-concepts.road-marking-concept.instruction'
    );
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

  addRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedToRoadMarkingConcepts = await this.model.roadMarkingConcept
      .relatedToRoadMarkingConcepts;
    const relatedRoadMarkingConcepts = await this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.pushObject(relatedRoadMarking);
    relatedRoadMarkingConcepts.pushObject(relatedRoadMarking);

    await this.model.roadMarkingConcept.save();
  });

  removeRelatedRoadMarking = task(async (relatedRoadMarking) => {
    const relatedToRoadMarkingConcepts = await this.model.roadMarkingConcept
      .relatedToRoadMarkingConcepts;
    const relatedFromRoadMarkingConcepts = await this.model.roadMarkingConcept
      .relatedFromRoadMarkingConcepts;
    const relatedRoadMarkingConcepts = await this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.removeObject(relatedRoadMarking);
    relatedFromRoadMarkingConcepts.removeObject(relatedRoadMarking);
    relatedRoadMarkingConcepts.removeObject(relatedRoadMarking);

    await relatedRoadMarking.save();
    await this.model.roadMarkingConcept.save();
  });

  addRelatedRoadSign = task(async (relatedRoadSign) => {
    let relatedRoadSigns = await this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.roadMarkingConcept.save();
  });

  removeRelatedRoadSign = task(async (relatedRoadSign) => {
    let relatedRoadSigns = await this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.roadMarkingConcept.save();
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

  addRelatedTrafficLight = task(async (relatedTrafficLight) => {
    let relatedTrafficLights = await this.model.roadMarkingConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    this.model.roadMarkingConcept.save();
  });

  removeRelatedTrafficLight = task(async (relatedTrafficLight) => {
    let relatedTrafficLights = await this.model.roadMarkingConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    this.model.roadMarkingConcept.save();
  });

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value;
  }

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value;
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

  removeRoadMarkingConcept = task(async (roadMarkingConcept, event) => {
    event.preventDefault();

    await roadMarkingConcept.destroyRecord();
    this.router.transitionTo('road-marking-concepts');
  });

  @action
  addInstruction() {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      'new',
    );
  }

  @action
  editInstruction(template) {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      template.id,
    );
  }

  removeTemplate = task(async (template) => {
    let templates = await this.model.roadMarkingConcept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.model.roadMarkingConcept.save();
  });

  reset() {
    this.editedTemplate = null;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.isOpen = false;
    this.category = null;
    this.categoryRoadMarkings = null;
  }
}
