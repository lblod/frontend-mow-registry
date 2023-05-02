import { restartableTask } from 'ember-concurrency';
import { trackedTask } from 'ember-resources/util/ember-concurrency';

import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import ConceptModel from 'mow-registry/models/concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import Store from '@ember-data/store';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

interface Args {
  mainConcept: ConceptModel;
  relatedConcepts: TrafficLightConceptModel[];
  addRelated: (concept: TrafficLightConceptModel) => void;
  removeRelated: (concept: TrafficLightConceptModel) => void;
}

export default class ConceptFormsRelatedSignsComponent extends Component<Args> {
  @service declare store: Store;
  @tracked
  page = 0;
  @tracked
  sort = '';
  pageSize = 30;

  get mainConcept() {
    return this.args.mainConcept;
  }

  get relatedIds() {
    return new Set([...this.relatedConcepts.map((concept) => concept.id)]);
  }

  get relatedConcepts() {
    return this.args.relatedConcepts;
  }

  @action
  onPageChange(newPage: number) {
    this.page = newPage;
  }

  @action
  onSortChange(newSort: string) {
    this.sort = newSort;
  }

  isRelated = (concept: RoadSignConceptModel) => {
    return this.relatedIds.has(concept.id);
  };
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
}
