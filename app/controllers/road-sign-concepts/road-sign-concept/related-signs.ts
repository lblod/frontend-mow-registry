import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { restartableTask } from 'ember-concurrency';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import Store from '@ember-data/store';
import RoadSignConceptsRoadSignConceptRelatedSignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related-signs';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptRelatedSignsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptRelatedSignsRoute>;
  @service declare store: Store;
  @tracked
  page = 0;
  @tracked
  sort = '';
  pageSize = 30;

  get relatedSignIds() {
    return new Set([...this.model.relatedConcepts.map((sign) => sign.id)]);
  }

  get signRelation() {
    if (this.model.isSubSign) {
      return this.model.mainConcept.relatedFromRoadSignConcepts;
    } else {
      return this.model.mainConcept.relatedToRoadSignConcepts;
    }
  }

  loadPotentialConcepts = restartableTask(async ({ page, sort, pageSize }) => {
    return this.store.query('road-sign-concept', {
      sort,
      page: {
        number: page,
        size: pageSize,
      },
    });
  });

  potentialConcepts = trackedTask(this, this.loadPotentialConcepts, () => [
    {
      page: this.page,
      sort: this.sort,
      pageSize: this.pageSize,
    },
  ]);

  @action
  onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action
  onSortChange(newSort: string) {
    this.sort = newSort;
  }

  @action
  async addRelated(concept: RoadSignConceptModel) {
    this.signRelation.pushObject(concept);
    await this.model.mainConcept.save();
  }

  @action
  async removeRelated(concept: RoadSignConceptModel) {
    this.signRelation.removeObject(concept);
    await this.model.mainConcept.save();
  }

  isRelated = (concept: RoadSignConceptModel) => {
    return this.relatedSignIds.has(concept.id);
  };
}
