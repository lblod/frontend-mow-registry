import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptSubsignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/subsigns';
import { restartableTask } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RoadSignConceptsRoadSignConceptSubsignsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptSubsignsRoute>;
  @service declare store: Store;
  @tracked page = 0;
  @tracked sort = '';
  pageSize = 30;

  loadPotentialConcepts = restartableTask(async ({ page, sort, pageSize }) => {
    return this.store.query('road-sign-concept', {});
  });
  potentialConcepts = trackedTask(this, this.loadPotentialConcepts, () => [
    {
      page: this.page,
      sort: this.sort,
      pageSize: this.pageSize,
    },
  ]);
}
