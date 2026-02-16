import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class RoadSignConceptVariablesEditEditCodelistEditConceptController extends Controller {
  @service declare router: RouterService;

  goBack = () => {
    this.router.transitionTo(
      'road-sign-concepts.road-sign-concept.variables.edit.edit-codelist',
    );
  };
}
