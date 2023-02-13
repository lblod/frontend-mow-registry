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
    if (!this.relatedTrafficLightCodeFilter.trim()) {
      return this.model.allTrafficLights;
    }

    return this.model.allTrafficLights.filter((trafficLight) => {
      return trafficLight.definition
        .toLowerCase()
        .includes(this.relatedTrafficLightCodeFilter.toLowerCase().trim());
    });
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

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value.trim();
  }

  @task
  *addRelatedTrafficLight(relatedTrafficLight) {
    const relatedToTrafficLightConcepts = yield this.model.trafficLightConcept
      .relatedToTrafficLightConcepts;
    const relatedTrafficLightConcepts = yield this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedToTrafficLightConcepts.pushObject(relatedTrafficLight);
    relatedTrafficLightConcepts.pushObject(relatedTrafficLight);

    yield this.model.trafficLightConcept.save();
  }

  @task
  *addRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = yield this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.trafficLightConcept.save();
  }

  @task
  *removeRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = yield this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.trafficLightConcept.save();
  }

  @task
  *addRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = yield this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.pushObject(relatedRoadMarking);
    this.model.trafficLightConcept.save();
  }

  @task
  *removeRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = yield this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.removeObject(relatedRoadMarking);

    this.model.trafficLightConcept.save();
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
  *removeRelatedTrafficLight(relatedTrafficLight) {
    const relatedToTrafficLightConcepts = yield this.model.trafficLightConcept
      .relatedToTrafficLightConcepts;
    const relatedFromTrafficLightConcepts = yield this.model.trafficLightConcept
      .relatedFromTrafficLightConcepts;
    const relatedTrafficLightConcepts = yield this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedToTrafficLightConcepts.removeObject(relatedTrafficLight);
    relatedFromTrafficLightConcepts.removeObject(relatedTrafficLight);
    relatedTrafficLightConcepts.removeObject(relatedTrafficLight);

    yield relatedTrafficLight.save();
    yield this.model.trafficLightConcept.save();
  }

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value.trim();
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
  *removeTrafficLightConcept(trafficLightConcept, event) {
    event.preventDefault();

    yield trafficLightConcept.destroyRecord();
    this.router.transitionTo('traffic-light-concepts');
  }

  @action
  addInstruction() {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      'new'
    );
  }

  @task
  *updateInstruction() {
    this.editedTemplate.value = this.newDescription;
    yield this.editedTemplate.save();
    this.resetInstruction();
  }

  @action editInstruction(template) {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.instruction',
      template.id
    );
  }

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith(
        'traffic-light-concepts.traffic-light-concept'
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

  @task
  *removeTemplate(template) {
    let templates = yield this.model.trafficLightConcept.templates;

    templates.removeObject(template);

    yield template.destroyRecord();
    yield this.model.trafficLightConcept.save();
  }

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
