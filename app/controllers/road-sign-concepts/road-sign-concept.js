import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service('router') routerService;

  @tracked isAddingSubSigns = false;
  @tracked isAddingMainSigns = false;
  @tracked isAddingRelatedRoadSigns = false;

  @tracked category = null;
  @tracked categoryRoadSigns = null;

  @tracked subSignCodeFilter = '';

  get showSidebar() {
    return (
      this.isAddingRelatedRoadSigns ||
      this.isAddingMainSigns ||
      this.isAddingSubSigns
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

  get isSubSign() {
    return (
      this.model.roadSignConcept.categories.filter((category) => {
        return category.label === 'Onderbord';
      }).length === 1
    );
  }

  @action
  setSubSignCodeFilter(event) {
    this.subSignCodeFilter = event.target.value.trim();
  }

  @action
  async addSubSign(subSign) {
    let subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.pushObject(subSign);
    this.model.allSubSigns.removeObject(subSign);
    this.model.roadSignConcept.save();
  }

  @action
  async removeSubSign(subSign) {
    let subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.removeObject(subSign);
    this.model.allSubSigns.pushObject(subSign);
    this.model.roadSignConcept.save();
  }

  @action
  setMainSignCodeFilter(event) {
    this.mainSignCodeFilter = event.target.value.trim();
  }

  @action
  async addMainSign(mainSign) {
    let mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.pushObject(mainSign);
    this.categoryRoadSigns.removeObject(mainSign);
    this.model.roadSignConcept.save();
  }

  @action
  async removeMainSign(mainSign) {
    let mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.removeObject(mainSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(mainSign);
    }

    this.model.roadSignConcept.save();
  }

  @action
  async addRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.pushObject(relatedRoadSign);
    this.categoryRoadSigns.removeObject(relatedRoadSign);
    this.model.roadSignConcept.save();
  }

  @action
  async removeRelatedRoadSign(relatedRoadSign) {
    let relatedRoadSigns = await this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.roadSignConcept.save();
  }

  @action
  toggleAddSubSigns() {
    this.isAddingSubSigns = !this.isAddingSubSigns;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingMainSigns = false;
    this.subSignCodeFilter = '';
  }

  @action
  toggleAddMainSigns() {
    this.isAddingMainSigns = !this.isAddingMainSigns;
    this.isAddingRelatedRoadSigns = false;
    this.isAddingSubSigns = false;
    this.mainSignCodeFilter = '';
  }

  @action
  toggleAddRelatedRoadSigns() {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
  }

  @action
  async handleCategorySelection(category) {
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
  }

  @action
  async removeRoadSignConcept(roadSignConcept, event) {
    event.preventDefault();

    await roadSignConcept.destroyRecord();
    this.routerService.transitionTo('road-sign-concepts');
  }

  reset() {
    this.isAddingSubSigns = false;
    this.isAddingMainSigns = false;
    this.isAddingRelatedRoadSigns = false;
    this.category = null;
    this.categoryRoadSigns = null;
  }
}
