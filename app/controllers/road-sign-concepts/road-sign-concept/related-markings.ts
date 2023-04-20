import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { action } from '@ember/object';
import RoadSignConceptsRoadSignConceptRelatedMarkingsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related-markings';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';

export default class RoadSignConceptsRoadSignConceptRelatedMarkingsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptRelatedMarkingsRoute>;
  @service declare store: Store;
  @tracked
  page = 0;
  @tracked
  sort = '';
  pageSize = 30;

  get relatedIds() {
    return new Set([...this.model.relatedConcepts.map((sign) => sign.id)]);
  }

  get mainConcept() {
    return this.model.mainConcept;
  }

  loadPotentialConcepts = restartableTask(async ({ page, sort, pageSize }) => {
    return this.store.query('road-marking-concept', {
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
  async addRelated(concept: RoadMarkingConceptModel) {
    this.mainConcept.relatedRoadMarkingConcepts.pushObject(concept);
    await this.mainConcept.save();
  }

  @action
  async removeRelated(concept: RoadMarkingConceptModel) {
    this.mainConcept.relatedRoadMarkingConcepts.removeObject(concept);
    await this.mainConcept.save();
  }

  isRelated = (concept: RoadMarkingConceptModel) => {
    return this.relatedIds.has(concept.id);
  };
}
