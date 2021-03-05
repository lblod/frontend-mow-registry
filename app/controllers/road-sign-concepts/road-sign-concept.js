import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @tracked isToShowSubSigns = false;
  @tracked isToShowRelated = false;

  queryParams = ['label'];
  @tracked category = null;
  @tracked model;

  @action
  async editSubSignRelation(subSign, event) {
    event.preventDefault();
    let subSigns = await this.model.roadSignConcept.subSigns;
    let roadSigns = await this.model.allSubSigns.roadSignConcepts;
    if (event.target.checked) {
      subSigns.pushObject(subSign);
      this.model.roadSignConcept.save();
      roadSigns.removeObject(subSign);
      this.model.allSubSigns.save();
    } else {
      subSigns.removeObject(subSign);
      this.model.roadSignConcept.save();
      roadSigns.pushObject(subSign);
      this.model.allSubSigns.save();
    }
  }

  @action
  async editRelatedRoadSignRelation(relatedRoadSign, event) {
    event.preventDefault();
    let relatedRoadSigns = await this.model.roadSignConcept
      .relatedRoadSignConcepts;
    if (!event.target.checked) {
      relatedRoadSigns.removeObject(relatedRoadSign);
      this.model.roadSignConcept.save();
    }
  }

  @action
  showEditSubSigns() {
    this.isToShowSubSigns = !this.isToShowSubSigns;
  }

  @action
  showEditRelatedRoadSigns() {
    this.isToShowRelated = !this.isToShowRelated;
  }

  get showSidebar() {
    return this.isToShowRelated || this.isToShowSubSigns;
  }

  get filteredCategoryLabel() {
    let category = this.category;
    let categories = this.model.categories;

    if (category) {
      return categories.filterBy('label', category.label);
    } else {
      return false;
    }
  }
}
