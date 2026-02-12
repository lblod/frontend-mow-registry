import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';

export default class RoadSignConceptVariablesEditController extends Controller {
  @service declare router: RouterService;

  goBack = () => {
    this.router.transitionTo('road-sign-concepts.road-sign-concept.variables');
  };

  goToEditCodelist = (codelist?: CodeList) => {
    this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.variables.edit',
      codelist?.id,
    );
  };
}
