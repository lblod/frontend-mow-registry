import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Icon from 'mow-registry/models/icon';
import CodelistsManagementCodelistRoute from 'mow-registry/routes/codelists-management/codelist';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class CodelistController extends Controller {
  declare model: ModelFrom<CodelistsManagementCodelistRoute>;
  @service declare router: RouterService;
  @tracked isOpen = false;

  @action
  async removeCodelist(event: InputEvent) {
    event.preventDefault();

    await Promise.all(
      (await this.model.codelist.concepts)
        .filter((model) => !(model instanceof Icon))
        .map((option) => option.destroyRecord()),
    );

    await this.model.codelist.destroyRecord();
    this.router.transitionTo('codelists-management');
  }

  reset() {
    this.isOpen = false;
  }
}
