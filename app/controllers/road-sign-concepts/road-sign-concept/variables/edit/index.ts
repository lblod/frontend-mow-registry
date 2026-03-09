import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import CodeList from 'mow-registry/models/code-list';

export default class RoadSignConceptVariablesEditController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;

  goBack = () => {
    this.router.transitionTo('road-sign-concepts.road-sign-concept.variables');
  };

  goToEditCodelist = (codelist?: CodeList) => {
    if (!codelist) {
      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept.variables.edit.edit-codelist',
        'new',
      );
    } else {
      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept.variables.edit.edit-codelist',
        codelist?.id,
      );
    }
  };
}
