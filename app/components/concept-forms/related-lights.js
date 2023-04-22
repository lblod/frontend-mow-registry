import { restartableTask } from 'ember-concurrency';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import ConceptFormsBaseComponent from './concept-forms-base';

export default class ConceptFormsRelatedLightsComponent extends ConceptFormsBaseComponent {
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
}
