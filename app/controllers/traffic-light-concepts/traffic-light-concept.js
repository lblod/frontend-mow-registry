import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service('router') router;

  @tracked isAddingSubSigns = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingRelatedTrafficLights = false;
  @tracked isOpen = false;

  @tracked category = null;
  @tracked categoryTrafficLights = null;

  @tracked relatedTrafficLightCodeFilter = '';
  @tracked newDescription = '';
  @tracked editedTemplate;

  get showSidebar() {
    return (
      this.isAddingRelatedTrafficLights ||
      this.isAddingMainSigns ||
      this.isAddingSubSigns ||
      this.hasActiveChildRoute
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

  @action
  setRelatedTrafficLightCodeFilter(event) {
    this.relatedTrafficLightCodeFilter = event.target.value.trim();
  }

  @action
  async addSubSign(subSign) {
    let subSigns = await this.model.trafficLightConcept.subSigns;
    subSigns.pushObject(subSign);
    this.model.allSubSigns.removeObject(subSign);
    this.model.trafficLightConcept.save();
  }

  @action
  async removeSubSign(subSign) {
    let subSigns = await this.model.trafficLightConcept.subSigns;
    subSigns.removeObject(subSign);
    this.model.allSubSigns.pushObject(subSign);
    this.model.trafficLightConcept.save();
  }

  @action
  setMainSignCodeFilter(event) {
    this.mainSignCodeFilter = event.target.value.trim();
  }

  @action
  async addRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    // this.categoryTrafficLights.removeObject(relatedTrafficLight);
    this.model.trafficLightConcept.save();
  }

  @action
  async removeRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    // if (this.categoryTrafficLights) {
    //   this.categoryTrafficLights.pushObject(relatedTrafficLight);
    // }

    this.model.trafficLightConcept.save();
  }

  @action
  toggleAddRelatedTrafficLights() {
    this.isAddingRelatedTrafficLights = !this.isAddingRelatedTrafficLights;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
  }

  @action
  async handleCategorySelection(category) {
    if (category) {
      this.category = category;
      let categoryTrafficLights = await category.trafficLightConcepts;
      let relatedTrafficLights = await this.model.trafficLightConcept
        .relatedTrafficLightConcepts;

      this.categoryTrafficLights = categoryTrafficLights.filter(
        (trafficLight) => {
          return (
            trafficLight.id !== this.model.trafficLightConcept.id &&
            !relatedTrafficLights.includes(trafficLight)
          );
        }
      );
    } else {
      this.category = null;
      this.categoryTrafficLights = null;
    }
  }

  @action
  async removeTrafficLightConcept(trafficLightConcept, event) {
    event.preventDefault();

    await trafficLightConcept.destroyRecord();
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

  @action
  async removeTemplate(template) {
    let templates = await this.model.trafficLightConcept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.model.trafficLightConcept.save();
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
