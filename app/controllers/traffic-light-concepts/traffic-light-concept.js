import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service('router') routerService;

  @tracked isAddingInstructions = false;
  @tracked isAddingSubSigns = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked category = null;
  @tracked categoryTrafficLights = null;

  @tracked relatedTrafficLightCodeFilter = '';

  get showSidebar() {
    return (
      this.isAddingRelatedTrafficLights ||
      this.isAddingMainSigns ||
      this.isAddingSubSigns ||
      this.isAddingInstructions
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
  toggleInstructions() {
    this.isAddingInstructions = !this.isAddingInstructions;
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
    this.routerService.transitionTo('traffic-light-concepts');
  }

  reset() {
    this.isAddingInstructions = false;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedTrafficLights = false;
    // this.category = null;
    // this.categoryTrafficLights = null;
  }
}
