import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import IconCatalogIconController from 'mow-registry/controllers/icon-catalog/icon';
import type Icon from 'mow-registry/models/icon';

type Params = {
  id: string;
};

export default class IconCatalogIconRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      icon: await this.store.findRecord<Icon>('icon', params.id),
    };
  }

  resetController(controller: IconCatalogIconController) {
    controller.reset();
  }
}
