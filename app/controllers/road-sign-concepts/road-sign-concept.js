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
    if (!this.subSignCodeFilter.trim()) {
      return this.model.allSubSigns;
    }

    return this.model.allSubSigns.filter((subSign) => {
      return subSign.roadSignConceptCode
        .toLowerCase()
        .includes(this.subSignCodeFilter.toLowerCase().trim());
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
  setSubSignCodeFilter(event) {
    this.subSignCodeFilter = event.target.value.trim();
  }

  @task
  *addSubSign(subSign) {
    let subSigns = yield this.model.roadSignConcept.subSigns;
    subSigns.pushObject(subSign);
    this.model.allSubSigns.removeObject(subSign);
    this.model.roadSignConcept.save();
  }

  @task
  *removeSubSign(subSign) {
    let subSigns = yield this.model.roadSignConcept.subSigns;
    subSigns.removeObject(subSign);
    this.model.allSubSigns.pushObject(subSign);
    this.model.roadSignConcept.save();
  }

  @action
  setMainSignCodeFilter(event) {
    this.mainSignCodeFilter = event.target.value.trim();
  }

  @action
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value.trim();
  }

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value.trim();
  }

  @task
  *addMainSign(mainSign) {
    let mainSigns = yield this.model.roadSignConcept.mainSigns;

    mainSigns.pushObject(mainSign);
    this.categoryRoadSigns.removeObject(mainSign);
    this.model.roadSignConcept.save();
  }

  @task
  *removeMainSign(mainSign) {
    let mainSigns = yield this.model.roadSignConcept.mainSigns;

    mainSigns.removeObject(mainSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(mainSign);
    }

    this.model.roadSignConcept.save();
  }

  @task
  *addRelatedRoadSign(relatedRoadSign) {
    const relatedToRoadSignConcepts = yield this.model.roadSignConcept
      .relatedToRoadSignConcepts;
    const relatedRoadSignConcepts = yield this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedToRoadSignConcepts.pushObject(relatedRoadSign);
    relatedRoadSignConcepts.pushObject(relatedRoadSign);

    yield this.model.roadSignConcept.save();
  }

  @task
  *removeRelatedRoadSign(relatedRoadSign) {
    const relatedToRoadSignConcepts = yield this.model.roadSignConcept
      .relatedToRoadSignConcepts;
    const relatedFromRoadSignConcepts = yield this.model.roadSignConcept
      .relatedFromRoadSignConcepts;
    const relatedRoadSignConcepts = yield this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedToRoadSignConcepts.removeObject(relatedRoadSign);
    relatedFromRoadSignConcepts.removeObject(relatedRoadSign);
    relatedRoadSignConcepts.removeObject(relatedRoadSign);

    yield relatedRoadSign.save();
    yield this.model.roadSignConcept.save();
  }

  @task
  *addRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = yield this.model.roadSignConcept
      .relatedRoadMarkingConcepts;
    relatedRoadMarkings.pushObject(relatedRoadMarking);
    yield relatedRoadMarking.save();
  }

  @task
  *removeRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = yield this.model.roadSignConcept
      .relatedRoadMarkingConcepts;
    relatedRoadMarkings.removeObject(relatedRoadMarking);
    yield relatedRoadMarking.save();
  }

  @task
  *addRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = yield this.model.roadSignConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    this.model.roadSignConcept.save();
  }

  @task
  *removeRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = yield this.model.roadSignConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    this.model.roadSignConcept.save();
  }

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

  @task
  *handleCategorySelection(category) {
    if (category) {
      this.category = category;
      let categoryRoadSigns = yield category.roadSignConcepts;
      let relatedRoadSigns = yield this.model.roadSignConcept
        .relatedRoadSignConcepts;
      let mainRoadSigns = yield this.model.roadSignConcept.mainSigns;

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
  }

  get isAddingInstructions() {
    return (
      this.router.currentRouteName ===
      'road-sign-concepts.road-sign-concept.instruction'
    );
  }

  @task
  *removeRoadSignConcept(roadSignConcept, event) {
    event.preventDefault();

    yield roadSignConcept.destroyRecord();
    this.router.transitionTo('road-sign-concepts');
  }

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

  @task
  *removeTemplate(template) {
    let templates = yield this.model.roadSignConcept.templates;

    templates.removeObject(template);

    yield template.destroyRecord();
    yield this.model.roadSignConcept.save();
  }
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
