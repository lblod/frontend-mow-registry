import Controller from '@ember/controller';
import { action } from '@ember/object';
import Router from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import IconModel from 'mow-registry/models/icon';
import CodelistsManagementCodelistRoute from 'mow-registry/routes/codelists-management/codelist';
import { ModelFrom } from 'mow-registry/utils/type-utils';

export default class CodelistController extends Controller {
  declare model: ModelFrom<CodelistsManagementCodelistRoute>;
  @service declare router: Router;
  @tracked isOpen = false;

  @action
  async removeCodelist(event: InputEvent) {
    event.preventDefault();

    await Promise.all(
      this.model.codelist.concepts
        .filter((model) => !(model instanceof IconModel))
        .map((option) => option.destroyRecord()),
    );

    await this.model.codelist.destroyRecord();
    await this.router.transitionTo('codelists-management');
  }

  reset() {
    this.isOpen = false;
  }
}
