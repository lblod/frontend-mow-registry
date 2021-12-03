import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadmarkingConceptsRoadmarkingConceptController extends Controller {
  @service router;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

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
        'road-marking-concepts.road-marking-concept'
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
    if (!this.relatedRoadMarkingCodeFilter.trim()) {
      return this.model.allRoadMarkings;
    }

    return this.model.allRoadMarkings.filter((roadMarking) => {
      return roadMarking.definition
        .toLowerCase()
        .includes(this.relatedRoadMarkingCodeFilter.toLowerCase().trim());
    });
  }

  get trafficLights() {
    if (!this.relatedTrafficLightCodeFilter.trim()) {
      return this.model.allTrafficLights;
    }

    return this.model.allTrafficLights.filter((trafficLight) => {
      return trafficLight.definition
        .toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase().trim());
    });
  }

  @action
  async addRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = await this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.pushObject(relatedRoadMarking);
    this.model.roadMarkingConcept.save();
  }

  @action
  async removeRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = await this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.removeObject(relatedRoadMarking);

    this.model.roadMarkingConcept.save();
  }

  @action
  async addRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.roadMarkingConcept.save();
  }

  @action
  async removeRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.roadMarkingConcept.save();
  }

  @action
  async handleCategorySelection(category) {
    if (category) {
      this.category = category;
      let categoryRoadSigns = await category.roadSignConcepts;

      this.categoryRoadSigns = categoryRoadSigns;
    } else {
      this.category = null;
      this.categoryRoadSigns = null;
    }
  }

  @action
  async addRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.roadMarkingConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    this.model.roadMarkingConcept.save();
  }

  @action
  async removeRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.roadMarkingConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    this.model.roadMarkingConcept.save();
  }

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value.trim();
  }

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value.trim();
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

  @action
  async removeRoadMarkingConcept(roadMarkingConcept, event) {
    event.preventDefault();

    await roadMarkingConcept.destroyRecord();
    this.router.transitionTo('road-marking-concepts');
  }

  @action
  async addInstruction() {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      'new'
    );
  }

  @action editInstruction(template) {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      template.id
    );
  }

  @action
  async removeTemplate(template) {
    let templates = await this.model.roadMarkingConcept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.model.roadMarkingConcept.save();
  }

  reset() {
    this.editedTemplate = null;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.category = null;
    this.categoryRoadMarkings = null;
  }
}
