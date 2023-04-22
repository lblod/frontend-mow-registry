import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { action } from '@ember/object';
import RoadSignConceptsRoadSignConceptRelatedLightsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related-lights';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

export default class RoadSignConceptsRoadSignConceptRelatedLightsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptRelatedLightsRoute>;
  @service declare store: Store;
  @tracked
  page = 0;
  @tracked
  sort = '';
  pageSize = 30;

  get relatedIds() {
    return new Set([...this.model.relatedConcepts.map((light) => light.id)]);
  }

  get mainConcept() {
    return this.model.mainConcept;
  }

  loadPotentialConcepts = restartableTask(async ({ page, sort, pageSize }) => {
    return this.store.query('traffic-light-concept', {
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
  async addRelated(concept: TrafficLightConceptModel) {
    this.mainConcept.relatedTrafficLightConcepts.pushObject(concept);
    await this.mainConcept.save();
  }

  @action
  async removeRelated(concept: TrafficLightConceptModel) {
    this.mainConcept.relatedTrafficLightConcepts.removeObject(concept);
    await this.mainConcept.save();
  }

  isRelated = (concept: TrafficLightConceptModel) => {
    return this.relatedIds.has(concept.id);
  };
}
