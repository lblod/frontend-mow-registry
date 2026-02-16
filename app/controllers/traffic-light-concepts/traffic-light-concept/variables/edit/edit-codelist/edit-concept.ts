import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class RoadSignConceptVariablesEditController extends Controller {
  @service declare router: RouterService;

  goBack = () => {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.variables.edit.edit-codelist',
    );
  };
}
