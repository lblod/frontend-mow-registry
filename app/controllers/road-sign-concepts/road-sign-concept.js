import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @tracked isEditingSubSigns = false;
  @tracked isEditingRelated = false;

  @tracked category = null;

  @action
  async editSubSignRelation(subSign, event) {
    event.preventDefault();
    let subSigns = await this.model.roadSignConcept.subSigns;
    if (event.target.checked) {
      subSigns.pushObject(subSign);
      this.model.roadSignConcept.save();
    } else {
      subSigns.removeObject(subSign);
      this.model.roadSignConcept.save();
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
    } else {
      relatedRoadSigns.removeObject(relatedRoadSign);
      this.model.roadSignConcept.save();
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

  get showSidebar() {
    return this.isEditingRelated || this.isEditingSubSigns;
  }

  get filteredCategoryLabel() {
    let category = this.category;
    let categories = this.model.categories;
    if (category) {
      let filteredRoadSignsByCategory = categories.filter(function (cat) {
        return cat.label.indexOf(category.label) !== -1;
      });
      return filteredRoadSignsByCategory.firstObject;
    } else {
      return false;
    }
  }
}
