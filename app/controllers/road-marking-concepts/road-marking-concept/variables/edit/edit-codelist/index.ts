import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CodeList from 'mow-registry/models/code-list';

export default class RoadSignConceptVariablesEditEditCodelistController extends Controller {
  @service declare router: RouterService;

  goBack = () => {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.variables.edit',
    );
  };

  goToEditConcept = (codelist?: CodeList) => {
    this.router.transitionTo(
      'road-marking-concepts.road-marking-concept.variables.edit.edit-codelist.edit-concept',
      codelist?.id,
    );
  };
}
