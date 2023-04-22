import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ConceptFormsBaseComponent extends Component {
  @service store;
  @tracked
  page = 0;
  @tracked
  sort = '';
  pageSize = 30;

  get model() {
    return this.args.model;
  }

  get relatedIds() {
    return new Set([...this.relatedConcepts.map((concept) => concept.id)]);
  }

  get relations() {
    if (this.model.related) {
      return [this.model.related];
    } else {
      return [this.model.relatedFrom, this.model.relatedTo];
    }
  }

  get relatedConcepts() {
    let rel = this.relations;
    if (rel.length === 1) {
      return rel[0];
    } else {
      return [...rel[0], ...rel[1]];
    }
  }

  @action
  onPageChange(newPage) {
    this.page = newPage;
  }

  @action
  onSortChange(newSort) {
    this.sort = newSort;
  }

  @action
  async addRelated(concept) {
    for (const rel of this.relations) {
      rel.pushObject(concept);
    }
    await this.model.mainConcept.save();
  }

  @action
  async removeRelated(concept) {
    for (const rel of this.relations) {
      rel.removeObject(concept);
    }

    await this.model.mainConcept.save();
  }

  isRelated = (concept) => {
    return this.relatedIds.has(concept.id);
  };
}
