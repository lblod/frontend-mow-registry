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

  @task
  *addRelatedRoadMarking(relatedRoadMarking) {
    const relatedToRoadMarkingConcepts = yield this.model.roadMarkingConcept
      .relatedToRoadMarkingConcepts;
    const relatedRoadMarkingConcepts = yield this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.pushObject(relatedRoadMarking);
    relatedRoadMarkingConcepts.pushObject(relatedRoadMarking);

    yield this.model.roadMarkingConcept.save();
  }

  @task
  *removeRelatedRoadMarking(relatedRoadMarking) {
    const relatedToRoadMarkingConcepts = yield this.model.roadMarkingConcept
      .relatedToRoadMarkingConcepts;
    const relatedFromRoadMarkingConcepts = yield this.model.roadMarkingConcept
      .relatedFromRoadMarkingConcepts;
    const relatedRoadMarkingConcepts = yield this.model.roadMarkingConcept
      .relatedRoadMarkingConcepts;

    relatedToRoadMarkingConcepts.removeObject(relatedRoadMarking);
    relatedFromRoadMarkingConcepts.removeObject(relatedRoadMarking);
    relatedRoadMarkingConcepts.removeObject(relatedRoadMarking);

    yield relatedRoadMarking.save();
    yield this.model.roadMarkingConcept.save();
  }

  @task
  *addRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = yield this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.roadMarkingConcept.save();
  }

  @task
  *removeRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = yield this.model.roadMarkingConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.roadMarkingConcept.save();
  }

  @task
  *handleCategorySelection(category) {
    if (category) {
      this.category = category;
      let categoryRoadSigns = yield category.roadSignConcepts;

      this.categoryRoadSigns = categoryRoadSigns;
    } else {
      this.category = null;
      this.categoryRoadSigns = null;
    }
  }

  @task
  *addRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = yield this.model.roadMarkingConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    this.model.roadMarkingConcept.save();
  }

  @task
  *removeRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = yield this.model.roadMarkingConcept
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

  @task
  *removeRoadMarkingConcept(roadMarkingConcept, event) {
    event.preventDefault();

    yield roadMarkingConcept.destroyRecord();
    this.router.transitionTo('road-marking-concepts');
  }

  @action
  addInstruction() {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      'new'
    );
  }

  @action
  editInstruction(template) {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.instruction',
      template.id
    );
  }

  @task
  *removeTemplate(template) {
    let templates = yield this.model.roadMarkingConcept.templates;

    templates.removeObject(template);

    yield template.destroyRecord();
    yield this.model.roadMarkingConcept.save();
  }

  reset() {
    this.editedTemplate = null;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.isOpen = false;
    this.category = null;
    this.categoryRoadMarkings = null;
  }
}
