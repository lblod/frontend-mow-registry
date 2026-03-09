import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';

export default class TrafficLightConceptVariablesEditEditCodelistController extends Controller {
  @service declare router: RouterService;

  goBack = () => {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.variables.edit',
    );
  };

  goToEditConcept = (codelist?: CodeList) => {
    this.router.transitionTo(
      'traffic-light-concepts.traffic-light-concept.variables.edit.edit-codelist.edit-concept',
      codelist?.id,
    );
  };
}
