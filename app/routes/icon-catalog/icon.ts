import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import IconCatalogIconController from 'mow-registry/controllers/icon-catalog/icon';

type Params = {
  id: string;
};

export default class IconCatalogIconRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const model = {
      icon: await this.store.findRecord('icon', params.id),
    };

    return model;
  }

  resetController(controller: IconCatalogIconController) {
    controller.reset();
  }
}
