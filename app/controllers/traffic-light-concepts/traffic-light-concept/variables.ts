import Controller from '@ember/controller';
import { tracked } from 'tracked-built-ins';
import { service } from '@ember/service';
import type Variable from 'mow-registry/models/variable';

import type RouterService from '@ember/routing/router-service';
export default class TrafficLightConceptVariablesController extends Controller {
  @service declare router: RouterService;
  queryParams = ['pageNumber', 'sort'];

  pageSize = 20;
  @tracked pageNumber = 0;
  @tracked sort?: string = 'created-on';

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
  };

  onSortChange = (newSort: string) => {
    this.sort = newSort;
  };
  goToEditVariable = (variable?: Variable) => {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.variables.edit',
      variable?.id || 'new',
    );
  };
}
