import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RoadmarkingConceptsRoadmarkingConceptController extends Controller {
  @service('router') routerService;

  @tracked isAddingInstructions = false;
  @tracked isAddingRelatedRoadMarkings = false;
  @tracked isAddingRelatedRoadSigns = false;

  @tracked category = null;
  @tracked categoryRoadMarkings = null;
  @tracked categoryRoadSigns = null;

  @tracked relatedRoadMarkingCodeFilter = '';

  get showSidebar() {
    return this.isAddingRelatedRoadMarkings || this.isAddingRelatedRoadSigns ||
    this.isAddingInstructions;
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
    let relatedRoadSigns = await this.model.roadSignConcept
      .relatedRoadSignConcepts;

    relatedRoadSigns.removeObject(relatedRoadSign);

    if (this.categoryRoadSigns) {
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }

    this.model.roadSignConcept.save();
  }

  @action
  toggleInstructions() {
    this.isAddingInstructions = !this.isAddingInstructions;
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
  setRelatedRoadMarkingCodeFilter(event) {
    this.relatedRoadMarkingCodeFilter = event.target.value.trim();
  }

  @action
  toggleAddRelatedRoadMarkings() {
    this.isAddingRelatedRoadMarkings = !this.isAddingRelatedRoadMarkings;
    this.isAddingRelatedRoadSigns = false;
  }

  @action
  toggleAddRelatedRoadSigns() {
    this.isAddingRelatedRoadSigns = !this.isAddingRelatedRoadSigns;
    this.isAddingRelatedRoadMarkings = false;
  }

  @action
  async removeRoadMarkingConcept(roadMarkingConcept, event) {
    event.preventDefault();

    await roadMarkingConcept.destroyRecord();
    this.routerService.transitionTo('road-marking-concepts');
  }

  reset() {
    this.isAddingInstructions = false;
    this.isAddingRelatedRoadMarkings = false;
    this.isAddingRelatedRoadSigns = false;
    this.category = null;
    this.categoryRoadMarkings = null;
  }
}
