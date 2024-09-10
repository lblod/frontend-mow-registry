import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import IconCatalogIconRoute from 'mow-registry/routes/icon-catalog/icon';
import Icon from 'mow-registry/models/icon';

export default class IconCatalogIconController extends Controller {
  @service declare router: RouterService;
  declare model: ModelFrom<IconCatalogIconRoute>;

  @tracked isOpen = false;

  removeIcon = task(async (icon: Icon, event: InputEvent) => {
    event.preventDefault();

    await icon.destroyRecord();
    await this.router.transitionTo('icon-catalog');
  });

  reset() {
    this.isOpen = false;
  }
}
