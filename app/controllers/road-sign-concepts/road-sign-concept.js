import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @tracked isEditingSubSigns = false;
  @tracked isEditingRelated = false;

  @tracked category = null;
  @tracked categoryRoadSigns = null;

  @action
  async editSubSignRelation(subSign, event) {
    event.preventDefault();
    let subSigns = await this.model.roadSignConcept.subSigns;
    if (event.target.checked) {
      subSigns.pushObject(subSign);
      this.model.roadSignConcept.save();
      this.model.allSubSigns.removeObject(subSign);
    } else {
      subSigns.removeObject(subSign);
      this.model.roadSignConcept.save();
      this.model.allSubSigns.pushObject(subSign);
    }
  }

  @action
  async editRelatedRoadSignRelation(relatedRoadSign, event) {
    event.preventDefault();
    let relatedRoadSigns = await this.model.roadSignConcept
      .relatedRoadSignConcepts;
    if (event.target.checked) {
      relatedRoadSigns.pushObject(relatedRoadSign);
      this.model.roadSignConcept.save();
      this.categoryRoadSigns.removeObject(relatedRoadSign);
    } else {
      relatedRoadSigns.removeObject(relatedRoadSign);
      this.model.roadSignConcept.save();
      this.categoryRoadSigns.pushObject(relatedRoadSign);
    }
  }

  @action
  toggleEditSubSigns() {
    this.isEditingSubSigns = !this.isEditingSubSigns;
    this.isEditingRelated = false;
  }

  @action
  toggleEditRelatedRoadSigns() {
    this.isEditingRelated = !this.isEditingRelated;
    this.isEditingSubSigns = false;
  }

  @action
  async handleCategorySelection(category) {
    if (category) {
      this.category = category;
      let categoryRoadSigns = await category.roadSignConcepts;
      let relatedRoadSigns = await this.model.roadSignConcept
        .relatedRoadSignConcepts;

      this.categoryRoadSigns = categoryRoadSigns.filter((roadSign) => {
        return (
          roadSign.id !== this.model.roadSignConcept.id &&
          !relatedRoadSigns.includes(roadSign)
        );
      });
    } else {
      this.category = null;
      this.categoryRoadSigns = null;
    }
  }

  get showSidebar() {
    return this.isEditingRelated || this.isEditingSubSigns;
  }

  reset() {
    this.isEditingSubSigns = false;
    this.isEditingRelated = false;
    this.category = null;
    this.categoryRoadSigns = null;
  }
}
