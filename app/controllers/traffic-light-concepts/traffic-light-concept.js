import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service('router') routerService;

  @tracked isAddingRelatedRoadSigns = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedTrafficLights = false;

  @tracked category = null;
  @tracked categoryTrafficLights = null;
  @tracked categoryRoadMarkings = null;
  @tracked categoryRoadSigns = null;

  @tracked relatedTrafficLightCodeFilter = '';
  @tracked relatedRoadMarkingCodeFilter = '';

  get showSidebar() {
    return (
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

  @action
  async addRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.pushObject(relatedTrafficLight);
    // this.categoryTrafficLights.removeObject(relatedTrafficLight);
    this.model.trafficLightConcept.save();
  }

  @action
  async addRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.trafficLightConcept.save();
  }

  @action
  async removeRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.trafficLightConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.trafficLightConcept.save();
  }

  @action
  async addRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.pushObject(relatedRoadMarking);
    this.model.trafficLightConcept.save();
  }

  @action
  async removeRelatedRoadMarking(relatedRoadMarking) {
    let relatedRoadMarkings = await this.model.trafficLightConcept
      .relatedRoadMarkingConcepts;

    relatedRoadMarkings.removeObject(relatedRoadMarking);

    this.model.trafficLightConcept.save();
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
  async removeRelatedTrafficLight(relatedTrafficLight) {
    let relatedTrafficLights = await this.model.trafficLightConcept
      .relatedTrafficLightConcepts;

    relatedTrafficLights.removeObject(relatedTrafficLight);

    this.model.trafficLightConcept.save();
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

  // @action
  // async handleCategorySelection(category) {
  //   if (category) {
  //     this.category = category;
  //     let categoryTrafficLights = await category.trafficLightConcepts;
  //     let relatedTrafficLights = await this.model.trafficLightConcept
  //       .relatedTrafficLightConcepts;

  //     this.categoryTrafficLights = categoryTrafficLights.filter(
  //       (trafficLight) => {
  //         return (
  //           trafficLight.id !== this.model.trafficLightConcept.id &&
  //           !relatedTrafficLights.includes(trafficLight)
  //         );
  //       }
  //     );
  //   } else {
  //     this.category = null;
  //     this.categoryTrafficLights = null;
  //   }
  // }

  @action
  async removeTrafficLightConcept(trafficLightConcept, event) {
    event.preventDefault();

    await trafficLightConcept.destroyRecord();
    this.routerService.transitionTo('traffic-light-concepts');
  }

  reset() {
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedTrafficLights = false;
    // this.category = null;
    // this.categoryTrafficLights = null;
  }
}
