import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptSubsignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/subsigns';
import { restartableTask } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptSubsignsController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptSubsignsRoute>;

  @service declare store: Store;
  @tracked page = 0;
  @tracked sort = '';
  pageSize = 30;
  @tracked _selectedCategory = '';

  @action
  setCategory(category: string) {
    this._selectedCategory = category;
  }

  get selectedCategory() {
    return this._selectedCategory || this.model.categories?.[0] || '';
  }

  get relatedIds() {
    return new Set([...this.model.relatedConcepts.map((sign) => sign.id)]);
  }

  get isAddMainSigns() {
    return this.model.isSubSign;
  }

  @action
  async addSign(sign: RoadSignConceptModel) {
    this.model.relatedConcepts.pushObject(sign);
    this.model.mainConcept.save();
  }

  @action
  async removeSign(sign: RoadSignConceptModel) {
    this.model.relatedConcepts.removeObject(sign);
    this.model.mainConcept.save();
  }

  loadPotentialConcepts = restartableTask(
    async ({ page, sort, pageSize, categories }) => {
      return this.store.query('road-sign-concept', {
        sort: sort,
        page: {
          number: page,
          size: pageSize,
        },
        filter: {
          categories: {
            label: categories?.join(','),
          },
        },
      });
    }
  );
  potentialConcepts = trackedTask(this, this.loadPotentialConcepts, () => {
    let categories: (string | undefined)[];
    if (this.selectedCategory === '') {
      categories = this.model.categories;
    } else {
      categories = [this.selectedCategory];
    }
    return [
      {
        page: this.page,
        sort: this.sort,
        pageSize: this.pageSize,
        categories: categories,
      },
    ];
  });

  isRelated = (concept: RoadSignConceptModel) => {
    return this.relatedIds.has(concept.id);
  };
}
